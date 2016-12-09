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
	private _keyCount: number;
	private _newKey: boolean;

	private _curEffect: TileEffect;
	private _lastAdd: number;
	private _connectArr: Array<number>;
	private _removeArr: Array<number>;

	private _times: number;
	private _isFire: boolean;

	/**
	 * 开始
	 */
	public start() {
		this.setState(GridState.Start);
		this._hor = GameData.hor;
		this._ver = GameData.ver;

		this._times = 0;
		this._isFire = false;
		this.addTimes(0);
		this._selectArr = [];
		this._lastAdd = -1;
		this._connectArr = [];
		this._removeArr = [];
		this.showChests();
		this.initTileList();
		this.repair();
		this._newKey = true;
	}

	/**
	 * 结束
	 */
	public over() {
		this.touchEnd();
		this.setState(GridState.Over);
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
					this.setSelect();
					if (!cr1 && cr2) {
						for (let i = 0; i < length; i++) {
							this.select(this._selectArr[i], true);
						}
					}
				} else if (idx < length - 1 && idx >= 0) {
					for (let i = length - 1; i > idx; i--) {
						this.unselect(this._selectArr[i]);
					}
					this._selectArr.splice(idx + 1, length - 1 - idx);
					length = this._selectArr.length;

					var cr2 = this.canRemove;
					this.sign();
					this.setSelect();
					if (cr1 && !cr2) {
						for (let i = 0; i <= length - 1; i++) {
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

		var length = this._selectArr.length;
		for (let i = 0; i < length; i++) {
			this.unselect(this._selectArr[i]);
		}
		if (this.canRemove) {
			this._curEffect = TileEffect.NONE;
			this._connectArr.push(length);
			this._removeArr.push(length + this._signArr.length);
			this.remove();
		} else {
			this.setState(GridState.Idle);
		}
		this._selectArr = [];
		this.setSelect();
	}

	/**
	 * 设置选择光环
	 */
	private setSelect() {
		var type = 0;
		var cnt = this._selectArr.length
		if (cnt >= 20) {
			type = 4;
		} else if (cnt >= 14) {
			type = 3;
		} else if (cnt >= 7) {
			type = 2;
		} else if (cnt >= 4) {
			type = 1;
		}
		var pos;
		if (cnt > 0) {
			pos = this._selectArr[cnt - 1].pos;
		}
		this.applyFunc(GridCmd.SET_SELECT, pos, type);
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
			if (!td && tileData.type > 0 && !tileData.key) {
				td = tileData;
			}
			let x = tileData.pos.x;
			let y = tileData.pos.y;
			if (this._isFire) {
				tileData.isFire = true;
				tileData.removeFx = TileRemoveFx.Bomb;
			}
			let t = this.delTile(x, y, null, this.removeInterval * i);
			duration = Math.max(duration, t);
		}
		if (td) {
			var score = GameData.cacuScore(length);
			this.addScore(0, score, td.pos, td.type);
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

		var removeCnt = this._removeArr[this._removeArr.length - 1];
		var praise: number = 0;
		if (removeCnt >= 35) {
			praise = 3;
		} else if (removeCnt >= 30) {
			praise = 2;
		} else if (removeCnt >= 25) {
			praise = 1;
		}
		if (praise) {
			this.showPraise(praise);
		}

		if (!this._isFire && removeCnt >= 40) {
			this.setTimeout(this.moveTime, () => this.fire());
		}

		/** 附上钥匙、效果、时间、倍数 */
		var arr = [];
		for (let i = 0; i < removeArr.length; i++) {
			for (let j = 0; j < removeArr[i].length; j++) {
				arr.push(new Vector2(i, j));
			}
		}
		arr.sort(SortUtils.random);
		var keyPos: Vector2;
		if (this._newKey) {
			this._newKey = false;
			keyPos = arr.pop();
		}
		var effectPosArr: Array<Vector2> = [];
		var cc: number = 0;
		for (let i: number = this._lastAdd + 1; i < this._connectArr.length; i++) {
			cc += this._connectArr[i];
		}
		if (cc >= 15) {
			var cnt = Math.floor(cc / 15);
			for (let i = 0; i < cnt; i++) {
				effectPosArr.push(arr.pop());
			}
			this._lastAdd = this._connectArr.length - 1;
		}
		var timePos: Vector2;
		if (removeCnt >= 40) {
			timePos = arr.pop();
		}
		var timesPosArr: Array<Vector2> = [];
		if (this._curEffect == TileEffect.RANDOM) {
			for (let i = 0; i < 3; i++) {
				timesPosArr.push(arr.pop());
			}
		} else if (this._curEffect == TileEffect.KIND || removeCnt >= 20) {
			timesPosArr.push(arr.pop());
		}

		for (let x: number = 0; x < removeArr.length; x++) {
			let tmpArr: Array<number> = removeArr[x];
			tmpArr.sort(SortUtils.sortNum);

			for (let i: number = 0; i < tmpArr.length; i++) {
				let k = (keyPos != null) && (x == keyPos.x) && (i == keyPos.y);
				let e = null;
				for (let j: number = 0; j < effectPosArr.length; j++) {
					if ((x == effectPosArr[j].x) && (i == effectPosArr[j].y)) {
						let rand = Math.random();
						if (rand < 0.7) {
							e = TileEffect.BOMB
						} else {
							e = TileEffect.CROSS;
						}
					}
				}
				let t = (timePos != null) && (x == timePos.x) && (i == timePos.y);
				let ts = 0;
				for (let j: number = 0; j < timesPosArr.length; j++) {
					if ((x == timesPosArr[j].x) && (i == timesPosArr[j].y)) {
						ts = this._times + 1;
					}
				}

				let tileData = this.addTile(x, i - tmpArr.length, null, e, k, t, ts);
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
		if (!effect && this.checkFire(tileData)) {
			effect = TileEffect.BOMB;
		}
		var cnt = 0;
		if (this._effectCntArr[effect] == null) {
			this._effectCntArr[effect] = cnt = 1;
		} else {
			this._effectCntArr[effect] += 1;
			cnt = this._effectCntArr[effect];
		}
		var score = GameData.cacuEffectScore(tileData.effect, cnt);

		var duration = 0;
		var pos = tileData.pos;
		var posArr = this.getEffect(tileData);
		posArr.sort(SortUtils.random);
		var flag1 = (effect == TileEffect.BOMB || effect == TileEffect.CROSS);
		var flag2 = (effect == TileEffect.RANDOM);
		var flag3 = (effect == TileEffect.KIND);
		for (let i = 0; i < posArr.length; i++) {
			let p = posArr[i];
			let direction;
			let l = 0;
			let td = this.getTile(p.x, p.y);
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
				l = Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y));
			} else if (flag2) {
				direction = Direction.Center;
				l = p.x + 1;
			} else if (flag3) {
				l = i + 1;
				if (td) {
					td.removeFx = TileRemoveFx.Thunder;
				}
			}
			let t = this.delTile(p.x, p.y, direction, delay + l * this.effectInterval);
			if (td && td.key) {
				score += GameData.keyScore;
			} else if (td && td.times) {
				score += GameData.timesScore;
			}
			duration = Math.max(duration, t);
		}
		this.shake(tileData, delay);

		if (tileData.effect) {
			this.addScore(delay, score, tileData.pos, 0);
		}

		this._curEffect = Math.max(this._curEffect, tileData.effect);

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
		var effect = tileData.effect;
		if (!effect && this.checkFire(tileData)) {
			effect = TileEffect.BOMB;
		}
		switch (effect) {
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
	 * 进入爆炸模式
	 */
	private fire() {
		this._isFire = true;
		this.applyFunc(GameCmd.FIRE);
		this.applyControllerFunc(ControllerID.Game, GameCmd.FIRE);
	}

	/**
	 * 爆炸模式结束
	 */
	public fireOver() {
		this._isFire = false;
		if (this.isState(GridState.Select)) {
			for (let i = 0; i < this._selectArr.length; i++) {
				this._selectArr[i].isFire = false;
				this.sign();
			}
		}
	}

	/**
	 * 获取得分
	 */
	private addScore(delay: number, score: number, pos: Vector2, type: number) {
		this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_SCORE, delay, score, pos, type);
	}

	/**
	 * 添加时间
	 */
	private addTime() {
		this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_TIME);
	}

	/**
	 * 添加倍率
	 */
	private addTimes(delay: number, pos: Vector2 = null, ts: number = 0) {
		this._times += 1;
		this.updateTimes();
		this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_TIMES, delay, pos, ts);
	}

	/**
	 * 显示称赞
	 */
	private showPraise(type: number) {
		this.applyControllerFunc(ControllerID.Game, GameCmd.SHOW_PRAISE, type);
	}

	/**
	 * 显示宝箱
	 */
	private showChests() {
		this._ver -= 1;
		this._newKey = false;
		this._keyCount = 0;
		this.applyFunc(GridCmd.SHOW_CHESTS);
	}

	/**
	 * 隐藏宝箱
	 */
	private hideChests() {
		this._ver += 1;
		this.applyFunc(GridCmd.HIDE_CHESTS);
	}

	/**
	 * 解锁宝箱
	 */
	private unlockChest(pos: Vector2, type: number) {
		this._keyCount += 1;
		this.applyFunc(GridCmd.UNLOCK_CHEST, pos, type);
		if (this._keyCount >= 5) {
			this.setTimeout(1300, () => {
				this.applyControllerFunc(ControllerID.Game, GameCmd.SHOW_UNLOCK);
				this.hideChests();
				this.newRow();
			});
			return;
		}
		this._newKey = true;
	}

	/**
	 * 新增一行
	 */
	private newRow() {
		var arr = [];
		var chanceArr = [0.65, 0.85, 0.95, 1];
		var rand = Math.random();
		var idx1 = RandomUtils.limitInteger(0, this._hor - 1);
		var idx2 = RandomUtils.limitInteger(0, this._hor - 1);
		while (idx1 == idx2) {
			idx2 = RandomUtils.limitInteger(0, this._hor - 1);
		}
		var type = this.randomType();

		if (rand < chanceArr[0]) {
			for (let i = 0; i < this._hor; i++) {
				var td = this.addTile(i, this._ver - 1, type, null, false, idx1 == i);
				this._tileList[i][this._ver - 1] = td;
				arr.push(td);
			}
		} else if (rand < chanceArr[1]) {
			for (let i = 0; i < this._hor; i++) {
				var effect = (idx2 == i) ? TileEffect.KIND : null;
				var td = this.addTile(i, this._ver - 1, null, effect, false, idx1 == i);
				this._tileList[i][this._ver - 1] = td;
				arr.push(td);
			}
		} else if (rand < chanceArr[2]) {
			for (let i = 0; i < this._hor; i++) {
				var ts = (idx2 == i) ? (this._times + 1) : 0;
				var td = this.addTile(i, this._ver - 1, type, null, false, idx1 == i, ts);
				this._tileList[i][this._ver - 1] = td;
				arr.push(td);
			}
		} else {
			for (let i = 0; i < this._hor; i++) {
				var effect = (idx2 == i) ? TileEffect.RANDOM : null;
				var td = this.addTile(i, this._ver - 1, type, effect, false, idx1 == i);
				this._tileList[i][this._ver - 1] = td;
				arr.push(td);
			}
		}


		this.applyFunc(GridCmd.NEW_ROW, arr);
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
	private addTile(x: number, y: number, type: number = null, effect: TileEffect = null,
		key: boolean = false, time: boolean = false, times: number = 0): TileData {
		var tileData = new TileData();
		tileData.pos = new Vector2(x, y);
		tileData.type = type == null ? this.randomType() : type;
		tileData.effect = effect || TileEffect.NONE;
		tileData.key = key;
		tileData.time = time;
		tileData.times = times;
		if (effect) {
			tileData.type = 0;
		}
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

			if (tileData.key) {
				this.setTimeout(delay, () => {
					this.unlockChest(tileData.pos, tileData.type);
				});
				this.addScore(delay, GameData.keyScore, tileData.pos, tileData.type);
			} else if (tileData.time) {
				this.addTime();
			} else if (tileData.times > 0) {
				this.addTimes(delay, tileData.pos, tileData.times);
				this.addScore(delay, GameData.timesScore, tileData.pos, tileData.type);
			}

			if ((tileData.effect != TileEffect.NONE || this.checkFire(tileData)) && direction != Direction.Center) {
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
			if (!this._isShake) {
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
		dest.isFire = this._isFire;
		this.applyFunc(GridCmd.TILE_CONNECT, src, dest, hl);
	}

	/**
	 * 选择格子
	 */
	private select(tileData: TileData, hl: boolean) {
		tileData.isFire = this._isFire;
		this.applyFunc(GridCmd.TILE_SELECT, tileData, hl);

	}

	/**
	 * 取消选择格子
	 */
	private unselect(tileData: TileData) {
		tileData.isFire = false;
		this.applyFunc(GridCmd.TILE_UNSELECT, tileData);

	}

	/**
	 * 更新倍率
	 */
	private updateTimes() {
		var arr = this._tileList;
		if (!arr) {
			return;
		}
		for (let x = 0; x < this._tileList.length; x++) {
			for (let y = 0; y < this._tileList.length; y++) {
				let td = this._tileList[x][y];
				if (td && td.times > 0) {
					td.times = this._times + 1;
					this.applyFunc(GridCmd.TILE_CHANGE_TIMES, td);
				}
			}
		}
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
	 * 是否燃烧
	 */
	private checkFire(tileData: TileData): boolean {
		return tileData.isFire;
	}

	/**
	 * 设置状态
	 */
	private setState(state: GridState) {
		if (this.isState(GridState.Over)) return;
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
		return 450;
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
	Repair,
	Over
}