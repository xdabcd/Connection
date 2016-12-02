/**
 * 
 * 棋盘
 * 
 */
class GridModel extends BaseModel {
	private _tileList: Array<Array<TileData>>;
	private _hor: number;
	private _ver: number;
	private _state: GridState;
	private _selectArr: Array<TileData>;
	private _signArr: Array<TileData>;
	private _effectCntArr: Array<number>;
	private _isShake: boolean;

	/**
	 * 开始
	 */
	public start() {
		this.setState(GridState.Start);
		this._hor = GameData.hor;
		this._ver = GameData.ver;
		this._selectArr = [];
		this.initTileList();
		this.repair();
	}

	/**
	 * 触摸格子
	 */
	public touchTile(pos: Vector2) {
		var tileData = this.getTile(pos.x, pos.y);
		var length = this._selectArr.length;
		if (this.isState(GridState.Idle)) {
			this._selectArr = [tileData];
			this.select(tileData, false);
			this.setState(GridState.Select);
		} else if (this.isState(GridState.Select) && length) {
			if (this.curSelectType == 0 || tileData.type == 0 || this.curSelectType == tileData.type) {
				var idx = this._selectArr.indexOf(tileData);
				var end = this._selectArr[length - 1];
				var cr1 = this.canRemove;
				if (idx < 0 && tileData.pos.borderUpon(end.pos)) {
					this._selectArr.push(tileData);
					var cr2 = this.canRemove;
					this.connect(end, tileData, cr2);
					this.sign();
					if (!cr1 && cr2) {
						for (let i = 0; i < length; i++) {
							this.select(this._selectArr[i], true);
						}
					}
				} else if (idx == length - 2) {
					ArrayUtils.remove(this._selectArr, end);
					var cr2 = this.canRemove;
					this.unselect(end);
					this.sign();
					if (cr1 && !cr2) {
						for (let i = 0; i < length - 1; i++) {
							this.select(this._selectArr[i], false);
						}
					}
				}
			}
		}
	}

	/**
	 * 触摸结束
	 */
	public touchEnd() {
		if (!this.isState(GridState.Select)) return;

		for (let i = 0; i < this._selectArr.length; i++) {
			this.unselect(this._selectArr[i]);
		}
		if (this.canRemove) {
			this.remove();
		} else {
			this.setState(GridState.Idle);
		}
		this._selectArr = [];
	}

	/**
	 * 消除
	 */
	private remove() {
		this.setState(GridState.Remove);
		this._effectCntArr = [];
		this._isShake = false;
		var length = this._selectArr.length;
		var duration = 0;
		var td;
		for (let i = 0; i < length; i++) {
			let tileData = this._selectArr[i];
			if (!td && tileData.type > 0) {
				td = tileData;
			}
			let x = tileData.pos.x;
			let y = tileData.pos.y;
			let t = this.delTile(x, y, null, this.removeInterval * i);
			duration = Math.max(duration, t);
		}
		if (td) {
			var score = GameData.cacuScore(length);
			this.addScore(score, td.pos, td.type);
		}

		var pos = this._selectArr[length - 1].pos.clone();
		this.setTimeout(duration + this.interval, () => {
			this.addEffect(length, pos);
			this.repair();
		});
	}

	/**
	 * 生成带有效果的格子
	 */
	private addEffect(cnt: number, pos: Vector2) {
		var effect;
		if (cnt >= 20) {
			effect = TileEffect.RANDOM;
		} else if (cnt >= 14) {
			effect = TileEffect.KIND;
		} else if (cnt >= 7) {
			effect = TileEffect.CROSS;
		} else if (cnt >= 4) {
			effect = TileEffect.BOMB;
		}
		if (effect) {
			this._tileList[pos.x][pos.y] = this.addTile(pos.x, pos.y, 0, effect);
		}
	}

	/**
	 * 修复
	 */
	private repair(): void {
		var removeArr: Array<Array<number>> = [];
		var moveList: Array<MoveInfo> = [];
		for (let x: number = 0; x < this._hor; x++) {
			let temp = [];
			removeArr.push(temp);
			for (let y: number = 0; y < this._ver; y++) {
				if (!this.getTile(x, y)) {
					temp.push(y);
				}
			}
		}

		for (let x: number = 0; x < removeArr.length; x++) {
			let tmpArr: Array<number> = removeArr[x];
			tmpArr.sort(SortUtils.sortNum);
			for (let i: number = 0; i < tmpArr.length; i++) {
				let tileData = this.addTile(x, i - tmpArr.length);
				moveList.push(this.moveTile(tileData, new Vector2(x, i)));
			}

			for (let y: number = 0; y < this._ver; y++) {
				if (y < tmpArr[0]) {
					moveList.push(this.moveTile(this.getTile(x, y), new Vector2(x, y + tmpArr.length)));
				} else {
					tmpArr.shift();
					if (tmpArr.length == 0) break;
				}
			}
		}

		var moveTime: number = this.getMaxMoveDuration(moveList);
		this.setTimeout(moveTime + this.interval, () => {
			this.updateMovePosition(moveList);
			this.setState(GridState.Idle);
		});
	}

	/**
	 * 标记
	 */
	private sign() {
		this._signArr = [];
		if (this.canRemove) {
			this.getSign(this._selectArr);
		}
		this.applyFunc(GridCmd.TILE_SIGN, this._signArr);
	}

	/**
	 * 获取标记列表
	 */
	private getSign(arr: Array<TileData>) {
		for (let i = 0; i < arr.length; i++) {
			let posArr = this.getEffect(arr[i]);
			let f = arr[i].effect == TileEffect.RANDOM;
			for (let j = 0; j < posArr.length; j++) {
				let t = this.getTile(posArr[j].x, posArr[j].y);
				if (this._signArr.indexOf(t) < 0) {
					this._signArr.push(t);
					if (!f) {
						this.getSign([t]);
					}
				}
			}
		}
	}

	/**
	 * 执行效果
	 */
	private doEffect(tileData: TileData, delay: number): number {
		var effect = tileData.effect;
		var cnt = 0;
		if (this._effectCntArr[effect] == null) {
			this._effectCntArr[effect] = cnt = 1;
		} else {
			this._effectCntArr[effect] += 1;
			cnt = this._effectCntArr[effect];
		}
		var score = GameData.cacuEffectScore(tileData.effect, cnt);
		this.setTimeout(delay, () => {
			this.addScore(score, tileData.pos, 0);
		});

		var duration = 0;
		var pos = tileData.pos;
		var posArr = this.getEffect(tileData);
		posArr.sort(SortUtils.random);
		var flag1 = (tileData.effect == TileEffect.BOMB || tileData.effect == TileEffect.CROSS);
		var flag2 = (tileData.effect == TileEffect.RANDOM);
		var flag3 = (tileData.effect == TileEffect.KIND);
		for (let i = 0; i < posArr.length; i++) {
			let p = posArr[i];
			let direction;
			let l = 0;
			if (flag1) {
				if (p.y > pos.y) {
					direction = Direction.Down;
				} else if (p.y < pos.y) {
					direction = Direction.Up;
				} else if (p.x > pos.x) {
					direction = Direction.Right;
				} else {
					direction = Direction.Left;
				}
				l = Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y)) - 1;
			} else if (flag2) {
				direction = Direction.Center;
				l = p.x + 1;
			} else if (flag3) {
				l = i + 1;
				var td = this.getTile(p.x, p.y);
				if (td) {
					td.removeFx = TileRemoveFx.Thunder;
				}
			}

			let t = this.delTile(p.x, p.y, direction, delay + l * this.effectInterval);
			duration = Math.max(duration, t);
		}
		this.shake(tileData, delay);

		return duration;
	}

	/**
	 * 震动
	 */
	private shake(tileData: TileData, delay: number) {
		var pos = tileData.pos;
		var posArr = [];
		var hor = this._hor;
		var ver = this._ver;
		var add = (x: number, y: number) => {
			var pos = new Vector2(x, y);
			for (let i = 0; i < this._selectArr.length; i++) {
				if (this._selectArr[i].pos.equalTo(pos)) {
					return;
				}
			}
			for (let i = 0; i < this._signArr.length; i++) {
				if (this._signArr[i].pos.equalTo(pos)) {
					return;
				}
			}
			posArr.push(pos);
		}
		if (tileData.effect == TileEffect.BOMB) {
			let minX = Math.max(0, pos.x - 3);
			let maxX = Math.min(hor, pos.x + 4);
			let minY = Math.max(0, pos.y - 3);
			let maxY = Math.min(ver, pos.y + 4);
			for (let i = minX; i < maxX; i++) {
				for (let j = minY; j < maxY; j++) {
					add(i, j);
				}
			}
			for (let i = 0; i < posArr.length; i++) {
				let td = this.getTile(posArr[i].x, posArr[i].y);
				if (td) {
					this.shakeTile(td, pos, delay);
				}
			}
		} else if (tileData.effect == TileEffect.CROSS) {
			let minX = Math.max(0, pos.x - 1);
			let maxX = Math.min(hor - 1, pos.x + 1);
			let minY = Math.max(0, pos.y - 1);
			let maxY = Math.min(ver - 1, pos.y + 1);
			for (let i = 0; i < hor; i++) {
				add(i, minY);
				add(i, maxY);
			}
			for (let i = 0; i < ver; i++) {
				add(minX, i);
				add(maxX, i);
			}
			for (let i = 0; i < posArr.length; i++) {
				let p = posArr[i];
				let td = this.getTile(p.x, p.y);
				let l = Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y));
				var a = Math.max(Math.abs(pos.x - p.x), Math.abs(pos.y - p.y));
				let sx = (pos.x - p.x) / Math.abs(pos.x - p.x) * a + p.x;
				let sy = (pos.y - p.y) / Math.abs(pos.y - p.y) * a + p.y;
				if (td) {
					this.shakeTile(td, new Vector2(sx, sy), delay + l * this.effectInterval * 0.7);
				}
			}
		}

	}

	/**
	 * 获取效果
	 */
	private getEffect(tileData: TileData): Array<Vector2> {
		var posArr: Array<Vector2> = [];
		var add = (x: number, y: number) => {
			var pos = new Vector2(x, y);
			for (let i = 0; i < this._selectArr.length; i++) {
				if (this._selectArr[i].pos.equalTo(pos)) {
					return;
				}
			}
			posArr.push(pos);
		}
		var x = tileData.pos.x;
		var y = tileData.pos.y;
		var hor = this._hor;
		var ver = this._ver;
		switch (tileData.effect) {
			case TileEffect.BOMB:
				let minX = Math.max(0, x - 1);
				let maxX = Math.min(hor, x + 2);
				let minY = Math.max(0, y - 1);
				let maxY = Math.min(ver, y + 2);
				for (let i = minX; i < maxX; i++) {
					for (let j = minY; j < maxY; j++) {
						add(i, j);
					}
				}
				break;
			case TileEffect.CROSS:
				for (let i = 0; i < hor; i++) {
					add(i, y);
				}
				for (let i = 0; i < ver; i++) {
					add(x, i);
				}
				break;
			case TileEffect.KIND:
				let type = this.curSelectType;
				if (type == 0) {
					if (tileData.info) {
						type = tileData.info;
					} else {
						type = this.randomType();
						tileData.info = type;
					}
				}
				for (let i = 0; i < hor; i++) {
					for (let j = 0; j < ver; j++) {
						var td = this.getTile(i, j);
						if (td && td.type == type)
							add(i, j);
					}
				}
				break;
			case TileEffect.RANDOM:
				let arr = [];
				if (tileData.info) {
					arr = tileData.info;
				} else {
					for (let i = 0; i < hor; i++) {
						for (let j = 0; j < ver; j++) {
							var td = this.getTile(i, j);
							if (td) {
								arr.push(td);
							}
						}
					}
					arr.sort(SortUtils.random);
					tileData.info = arr;
				}
				let l = Math.min(arr.length, 23);
				for (let i = 0; i < l; i++) {
					add(arr[i].pos.x, arr[i].pos.y);
				}
				break;
		}
		return posArr;
	}

	/**
	 * 获取得分
	 */
	private addScore(score: number, pos: Vector2, type: number) {
		this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_SCORE, score, pos, type);
	}

	/**
	 * 初始化格子列表
	 */
	private initTileList(): void {
		this._tileList = [];
		for (var x: number = 0; x < this._hor; x++) {
			var temp = [];
			this._tileList.push(temp);
			// for (var y: number = 0; y < this._ver; y++) {
			// 	temp.push(this.addTile(x, y));
			// }
		}
	}

	/**
	 * 添加格子
	 */
	private addTile(x: number, y: number, type: number = null, effect: TileEffect = null): TileData {
		var tileData = new TileData();
		tileData.pos = new Vector2(x, y);
		tileData.type = type == null ? this.randomType() : type;
		tileData.effect = effect || TileEffect.NONE;
		this.creatTile(tileData);
		return tileData;
	}

	/**
	 * 删除格子
	 */
	private delTile(x: number, y: number, direction: Direction, delay: number): number {
		var duration = delay + this.removeTime;
		var tileData = this.getTile(x, y);
		if (tileData) {
			this._tileList[x][y] = null;
			if (direction != null && tileData.effect == TileEffect.NONE || direction == Direction.Center) {
				this.hitTile(tileData, this.removeTime, direction, delay);
			} else {
				this.removeTile(tileData, this.removeTime, delay);
			}

			if (tileData.effect != TileEffect.NONE && direction != Direction.Center) {
				var t = this.doEffect(tileData, delay);
				duration = Math.max(duration, t);
			}
		}
		return duration;
	}

	/**
	 * 创建格子
	 */
	private creatTile(tileData: TileData): void {
		this.applyFunc(GridCmd.TILE_CREATE, tileData);
	}

	/**
	 * 移除格子
	 */
	private removeTile(tileData: TileData, duration: number, delay: number = 0): void {
		this.setTimeout(delay, () => {
			this.applyFunc(GridCmd.TILE_REMOVE, tileData, duration);
		});

	}

	/**
	 * 震动格子
	 */
	private shakeTile(tileData: TileData, src: Vector2, delay: number = 0): void {
		this.setTimeout(delay, () => {
			this.applyFunc(GridCmd.TILE_SHAKE, tileData, src);
			if(!this._isShake){
				this.applyFunc(GridCmd.SHAKE);
				this._isShake = true;
			}
		});

	}

	/**
	 * 打击格子
	 */
	private hitTile(tileData: TileData, duration: number, direction: Direction, delay: number = 0): void {
		this.setTimeout(delay, () => {
			this.applyFunc(GridCmd.TILE_HIT, tileData, duration, direction);
		});
	}

	/**
	 * 连接格子
	 */
	private connect(src: TileData, dest: TileData, hl: boolean) {
		this.applyFunc(GridCmd.TILE_CONNECT, src, dest, hl);
	}

	/**
	 * 选择格子
	 */
	private select(tileData: TileData, hl: boolean) {
		this.applyFunc(GridCmd.TILE_SELECT, tileData, hl);

	}

	/**
	 * 取消选择格子
	 */
	private unselect(tileData: TileData) {
		this.applyFunc(GridCmd.TILE_UNSELECT, tileData);

	}

	/**
	 * 转化随机格子效果
	 */
	private changeRandomTileEffect(effect: TileEffect, targetEffect: TileEffect): void {
		var tileData: TileData = this.getRandomTile();
		while (tileData.effect != effect) {
			tileData = this.getRandomTile();
		}

		tileData.effect = targetEffect;
		this.applyFunc(GridCmd.TILE_CHANGE_EFFECT, tileData);
	}

	/**
	 * 获得随机格子
	 */
	private getRandomTile(): TileData {
		var xRand = RandomUtils.limitInteger(0, this._hor - 1);
		var yRand = RandomUtils.limitInteger(0, this._ver - 1);
		return this._tileList[xRand][yRand];
	}

	/**
	 * 移动格子
	 */
	private moveTile(tileData: TileData, target: Vector2): MoveInfo {
		var duration = this.cacuMoveTime(tileData.pos, target);
		var moveInfo = new MoveInfo(tileData, target, duration);
		this.setTimeout(RandomUtils.limit(0, 80), () => {
			this.applyFunc(GridCmd.TILE_MOVE, moveInfo);
		})
		return moveInfo;
	}

	/**
	 * 移动花费的最长时间
	 */
	private getMaxMoveDuration(moveList: Array<MoveInfo>): number {
		var duration = 0;
		for (var i: number = 0; i < moveList.length; i++) {
			duration = Math.max(duration, moveList[i].duration);
		}

		return duration;
	}

	/**
	 * 计算移动时间
	 */
	private cacuMoveTime(src: Vector2, target: Vector2) {
		return Math.sqrt(Math.abs(src.y - target.y)) * this.moveTime;
	}

	/**
	* 更新移动后的位置
	*/
	private updateMovePosition(moveList: Array<MoveInfo>): void {
		var moveTileList: Array<TileData> = [];
		for (var i: number = 0; i < moveList.length; i++) {
			moveTileList.push(moveList[i].tileData.clone());
		}

		for (var i: number = 0; i < moveList.length; i++) {
			var moveInfo: MoveInfo = moveList[i];
			moveTileList[i].pos = moveInfo.target.clone();
			this._tileList[moveInfo.target.x][moveInfo.target.y] = moveTileList[i];
		}
	}

	/**
	 * 获取格子数据
	 */
	private getTile(x: number, y: number): TileData {
		return this._tileList && this._tileList[x] && this._tileList[x][y];
	}

	/**
	 * 随机类型
	 */
	private randomType(): number {
		return RandomUtils.limitInteger(1, 4);
	}

	/**
	 * 当前选择类型
	 */
	private get curSelectType(): number {
		var type = 0;
		for (let i = 0; i < this._selectArr.length; i++) {
			type = this._selectArr[i].type;
			if (type != 0) {
				break;
			}
		}
		return type;
	}

	/**
	 * 是否可消除
	 */
	private get canRemove(): boolean {
		return this._selectArr.length >= 3;
	}

	/**
	 * 设置状态
	 */
	private setState(state: GridState) {
		this._state = state;
	}

	/**
	 * 确定状态
	 */
	private isState(state: GridState): boolean {
		return this._state == state;
	}

	/**
	 * 操作间隔
	 */
	private get interval(): number {
		return 50;
	}

	/**
	 * 移除所需时间
	 */
	private get removeTime(): number {
		return 300;
	}

	/**
	 * 移动时间
	 */
	private get moveTime(): number {
		return 400;
	}

	/**
	 * 移除间隔
	 */
	private get removeInterval(): number {
		return 100;
	}

	/**
	 * 效果间隔
	 */
	private get effectInterval(): number {
		return 80;
	}
}

/**
 * 棋盘状态
 */
enum GridState {
	Start,
	Idle,
	Select,
	Remove,
	REPAIR
}