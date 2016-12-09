/**
 * 
 * 棋盘
 * 
 */
class Grid extends BaseScene {
	private _bg: egret.Bitmap;
	private _border1: egret.Bitmap;
	private _border2: egret.Bitmap;
	private _bottom: egret.Bitmap;

	private _container: egret.DisplayObjectContainer;
	private _gridCon: egret.DisplayObjectContainer;
	private _arrowCon: egret.DisplayObjectContainer;
	private _tileCon: egret.DisplayObjectContainer;
	private _topTileCon: egret.DisplayObjectContainer;
	private _fxCon: egret.DisplayObjectContainer;
	private _hitCon: egret.DisplayObjectContainer;
	private _arrows: Array<Arrow>;
	private _select: egret.Bitmap;
	private _bm: egret.Sprite;
	private _chests: Chests;
	private _fire: FireFx;

	public constructor() {
        super();
        this._controller = new GridController(this);
		KeyboardUtils.addKeyUp((key) => {
			if (key == Keyboard.LEFT) {
				TimerManager.setTimeScale(1);
			}
		}, this);
		KeyboardUtils.addKeyDown((key) => {
			if (key == Keyboard.LEFT) {
				TimerManager.setTimeScale(0.05);
			}
		}, this);
		KeyboardUtils.addKeyUp((key) => {
			if (key == Keyboard.RIGHT) {
				TimerManager.setTimeScale(1);
			}
		}, this);
		KeyboardUtils.addKeyDown((key) => {
			if (key == Keyboard.RIGHT) {
				TimerManager.setTimeScale(5);
			}
		}, this);
    }

    /**
     * 初始化
     */
    protected init() {
		super.init();
		this.addChild(this._bg = DisplayUtils.createBitmap("grid_bg_png"));
		this.addChild(this._container = new egret.DisplayObjectContainer);

		this._border1 = DisplayUtils.createBitmap("grid_border_1_png");
		this._border2 = DisplayUtils.createBitmap("grid_border_2_png");
		this._bottom = DisplayUtils.createBitmap("grid_bottom_png");
		this.width = this._bg.width = this._border1.width + this._border2.width + 640;
		this.height = this._bg.height = this._border1.height;
		this.addChild(this._border1);
		this.addChild(this._border2);
		this.addChild(this._bottom);
		AnchorUtils.setAnchor(this._border2, 1);
		this._border2.x = this.width;
		this._border2.y = this.height;
		AnchorUtils.setAnchorX(this._bottom, 0.5);
		AnchorUtils.setAnchorY(this._bottom, 1);
		this._bottom.x = this.width / 2;
		this._bottom.y = this.height;

		this.addChild(this._chests = ObjectPool.pop("Chests"));
		AnchorUtils.setAnchorX(this._chests, 0.5);
		AnchorUtils.setAnchorY(this._chests, 1);
		this._chests.x = this.width / 2;
		this._chests.y = this.height + this._chests.height + 10;

		this.addChild(this._select = new egret.Bitmap);
		this._select.visible = false;

		this._container.addChild(this._gridCon = new egret.DisplayObjectContainer);
		this.initGrid();

		this._container.addChild(this._fire = new FireFx);
		this._fire.x = this.width / 2;
		this._fire.y = this.height;
		this._fire.alpha = 0.7;
		this._fire.visible = false;

		this._container.addChild(this._arrowCon = new egret.DisplayObjectContainer);
		this._arrows = [];

        this._container.addChild(this._tileCon = new egret.DisplayObjectContainer);
		this._container.addChild(this._fxCon = new egret.DisplayObjectContainer);
		this._container.addChild(this._hitCon = new egret.DisplayObjectContainer);
		this._container.addChild(this._bm = new egret.Sprite);
		this._container.addChild(this._topTileCon = new egret.DisplayObjectContainer);

		DrawUtils.drawRect(this._bm, this.width, this.height, 0);
		this._bm.touchEnabled = true;
		this._bm.visible = false;

		this.touchEnabled = true;
       	this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    }

	/**
	 * 初始化网格
	 */
	private initGrid() {
		for (let x = 0; x < this.hor; x++) {
			for (let y = 0; y < this.ver; y++) {
				if ((x + y) % 2) {
					let tp = this.getTruePosition(x, y);
					let g = DisplayUtils.createBitmap("gem_bg_1_png");
					AnchorUtils.setAnchor(g, 0.5);
					g.x = tp.x;
					g.y = tp.y;
					this._gridCon.addChild(g);
				}
			}
		}
	}

	/**
	 * 显示宝箱
	 */
	public showChests() {
		var tw = new Tween(this._chests);
		tw.to = { y: this.height + 16 };
		tw.duration = 600;
		tw.ease = TweenEase.CusOut;
		tw.start();
	}

	/**
	 * 隐藏宝箱
	 */
	public hideChests() {
		this._bm.visible = true;
		this._bm.alpha = 0;
		var tw1 = new Tween(this._bm);
		tw1.to = { alpha: 0.6 };
		tw1.duration = 200;
		tw1.start();
		var tw2 = new Tween(this._bm);
		tw2.to = { alpha: 0 };
		tw2.duration = 200;
		tw2.delay = 1000;
		tw2.callBack = () => {
			this._bm.visible = false;
		}
		tw2.start();

		var tw = new Tween(this._chests);
		tw.to = { y: this.height + this._chests.height + 10 };
		tw.duration = 600;
		tw.ease = TweenEase.CusIn;
		tw.start();
	}

	/**
	 * 解锁宝箱
	 */
	public unlockChest(pos: Vector2, type: number) {
		var tp = this.getTruePosition(pos.x, pos.y);
		this._chests.unlock(tp.x - this._chests.x + this._chests.anchorOffsetX,
			tp.y - this._chests.y + this._chests.anchorOffsetY, type);
	}

	/**
	 * 新增一行
	 */
	public newRow(arr: Array<TileData>) {
		for (let i = 0; i < arr.length; i++) {
			let tile = this.findTile(arr[i].pos);
			if (tile) {
				this._topTileCon.addChild(tile);
			}
		}
	}

	/**
	 * 显示爆炸模式
	 */
	public showFire() {
		this._fire.visible = true;
		this._fire.play();
	}

	/**
	 * 隐藏爆炸模式
	 */
	public hideFire() {
		this._fire.visible = false;
	}

	/**
	 * 创建格子
	 */
	public createTile(tileData: TileData) {
		var pos = tileData.pos;
		var tile = ObjectPool.pop("Tile") as Tile;
		tile.reset();
		tile.pos = pos.clone();
		var tp: Vector2 = this.getTruePosition(pos.x, pos.y);
		tile.x = tp.x;
		tile.y = tp.y;
		tile.type = tileData.type;
		tile.effect = tileData.effect;
		tile.key = tileData.key;
		tile.time = tileData.time;
		tile.times = tileData.times;
		tile.touchEnabled = true;
		tile.addTo(this._tileCon);
		tile.setOnTouch(() => { this.tileOnTouch(tile.pos); });
	}

	/**
	 * 移除格子
	 */
	public removeTile(tileData: TileData, duration: number) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			if (tile.parent != this._tileCon) {
				this._tileCon.addChild(tile);
			}
			if (tileData.effect != TileEffect.NONE) {
				this.addEffect(tileData.effect, tile.x, tile.y);
			} else {
				this.addRemoveFx(tileData.removeFx, tile.x, tile.y);
			}
			tile.remove(duration);
		}
	}

	/**
	 * 击中格子
	 */
	public hitTile(tileData: TileData, duration: number, direction: Direction) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			this._hitCon.addChild(tile);
			tile.hit(direction, duration);
		}
	}

	/**
	 * 震动
	 */
	public shake() {
		var t = 30;
		var tw1 = new Tween(this._gridCon);
		tw1.to = { y: 1 };
		tw1.duration = t;
		tw1.start();
		var tw2 = new Tween(this._gridCon);
		tw2.to = { y: 0 };
		tw2.duration = t * 2;
		tw2.delay = tw1.duration;
		tw2.start();
		var tw3 = new Tween(this._container);
		tw3.to = { y: -1 };
		tw3.duration = t;
		tw3.start();
		var tw4 = new Tween(this._container);
		tw4.to = { y: 3 };
		tw4.duration = t * 2;
		tw4.delay = tw3.duration;
		tw4.start();
		var tw5 = new Tween(this._container);
		tw5.to = { y: -3 };
		tw5.duration = t * 2.5;
		tw5.delay = tw4.duration + tw4.delay + t;
		tw5.start();
		var tw6 = new Tween(this._container);
		tw6.to = { y: 0 };
		tw6.duration = t;
		tw6.delay = tw5.duration + tw5.delay + t * 2;
		tw6.start();
		this._chests.shake();
	}

	/**
	 * 震动格子
	 */
	public shakeTile(tileData: TileData, src: Vector2) {
		var tile = this.findTile(tileData.pos);
		var pos = this.getTruePosition(src.x, src.y);
		if (tile) {
			tile.shake(pos.x, pos.y);
		}
	}

	/**
	 * 标记格子
	 */
	public signTiles(arr: Array<TileData>) {
		for (let i = 0; i < this._tileCon.numChildren; i++) {
			let tile = this._tileCon.getChildAt(i) as Tile;
			let f = false;
			for (let j = 0; j < arr.length; j++) {
				if (tile.pos.equalTo(arr[j].pos)) {
					f = true;
				}
			}
			tile.sign = f;
		}
	}

	/**
	 * 设置选择光环
	 */
	public setSelect(pos: Vector2, type: number) {
		if (type <= 0) {
			this._select.texture = null;
			this._select.visible = false;
		} else {
			this._select.visible = true;
			var tex = RES.getRes("select_" + type + "_png");
			var tr = this.getTruePosition(pos.x, pos.y);
			this._select.x = tr.x;
			this._select.y = tr.y;
			AnchorUtils.setAnchor(this._select, 0.5);
			if (tex != this._select.texture) {
				this._select.texture = tex;
				TweenManager.removeTween(this._select);
				this._select.rotation = 0;
				this._select.alpha = 0.5;
				this._select.scaleX = this._select.scaleY = 0.4;
				var tw1 = new Tween(this._select);
				tw1.to = { scaleX: 1 + (type - 1) * 0.25, scaleY: 1 + (type - 1) * 0.25, alpha: 1 };
				tw1.duration = 300;
				tw1.ease = TweenEase.CusOut;
				tw1.start();
				var tw2 = new Tween(this._select);
				tw2.to = { rotation: 360 };
				tw2.duration = 2000;
				tw2.delay = tw1.duration;
				tw2.loop = true;
				tw2.start();

			}
		}
	}

	/**
	 * 连接格子
	 */
	public connectTile(src: TileData, dest: TileData, hl: boolean) {
		var tile1 = this.findTile(src.pos);
		var tile2 = this.findTile(dest.pos);

		if (tile2) {
			tile2.select(hl);
			if (tile1) {
				this.addArrow(tile1.x, tile1.y, tile2.x, tile2.y);
			}
		}
	}

	/**
	 * 选中格子
	 */
	public selectTile(tileData: TileData, hl: boolean) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.select(hl);
		}
	}

	/**
	 * 取消选中格子
	 */
	public unselectTile(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.unselect();
			this.delArrow();
		}
	}

	/**
	 * 移动格子
	 */
	public moveTile(moveInfo: MoveInfo) {
		var tileData = moveInfo.tileData;
		var target = moveInfo.target;
		var duration = moveInfo.duration;
		var tile = this.findTile(tileData.pos);
		if (tile) {
			var targetPos = this.getTruePosition(target.x, target.y);
			tile.moveTo(targetPos, duration, () => {
				tile.pos = target.clone();
			});
		}
	}

	/**
	 * 改变格子效果
	 */
	public changeTileEffect(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.effect = tileData.effect;
		}
	}

	/**
	 * 改变格子效果
	 */
	public changeTileType(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.type = tileData.type;
		}
	}

	/**
	 * 改变格子倍率
	 */
	public changeTileTimes(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.times = tileData.times;
		}
	}

	/**
	 * 添加消失特效
	 */
	public addRemoveFx(removeFx: TileRemoveFx, x: number, y: number) {
		var fx: Fx;
		switch (removeFx) {
			case TileRemoveFx.Smoke:
				fx = ObjectPool.pop("SmokeFx") as SmokeFx;
				break;
			case TileRemoveFx.Bomb:
				fx = ObjectPool.pop("BombFx") as BombFx;
				break;
			case TileRemoveFx.Thunder:
				fx = ObjectPool.pop("ThunderFx") as ThunderFx;
				break;
		}
		fx.x = x;
		fx.y = y;
		this._fxCon.addChild(fx);
		fx.play();
	}

	/**
	 * 添加效果
	 */
	public addEffect(effect: TileEffect, x: number, y: number) {
		var fx: Fx;
		switch (effect) {
			case TileEffect.BOMB:
				fx = ObjectPool.pop("BombFx") as BombFx;
				break;
			case TileEffect.CROSS:
				fx = ObjectPool.pop("WaterFx") as WaterFx;
				break;
			case TileEffect.KIND:
				fx = ObjectPool.pop("ThunderFx") as ThunderFx;
				break;
			case TileEffect.RANDOM:
				fx = ObjectPool.pop("StormFx") as StormFx;
				let tr = this.getTruePosition(0, this.hor);
				x = tr.x;
				y = tr.y + 60;
				break;
		}
		if (fx) {
			fx.x = x;
			fx.y = y;
			this._fxCon.addChild(fx);
			fx.play();
		}
	}

	/**
	 * 添加箭头
	 */
	public addArrow(x1: number, y1: number, x2: number, y2: number) {
		var arrow = ObjectPool.pop("Arrow") as Arrow;
		arrow.x = (x1 + x2) / 2;
		arrow.y = (y1 + y2) / 2;
		arrow.rotation = MathUtils.getAngle(MathUtils.getRadian2(x1, y1, x2, y2));
		this._arrowCon.addChild(arrow);
		this._arrows.push(arrow);
	}

	/**
	 * 删除箭头
	 */
	public delArrow() {
		if (this._arrows.length) {
			this._arrows.pop().destroy();
		}
	}

	/**
	 * 格子触摸回调
	 */
	private tileOnTouch(pos: Vector2) {
		this.applyFunc(GridCmd.TOUCH_TILE, pos);
	}

	/**
     * 触摸结束回调
     */
    private onEnd(event: egret.Event) {
		this.applyFunc(GridCmd.TOUCH_END);
    }

	/**
	 * 找到对应位置的格子
	 */
	private findTile(pos): Tile {
		for (let i = 0; i < this._tileCon.numChildren; i++) {
			var tile = this._tileCon.getChildAt(i) as Tile;
			if (tile.pos.equalTo(pos)) {
				return tile;
			}
		}
		for (let i = 0; i < this._topTileCon.numChildren; i++) {
			var tile = this._topTileCon.getChildAt(i) as Tile;
			if (tile.pos.equalTo(pos)) {
				return tile;
			}
		}
		return;
	}

	/**
	 * 获取格子的真实位置
	 */
	private getTruePosition(x: number, y: number) {
		var x = this.width / 2 + this.tileSize * (x - this.hor / 2 + 1 / 2);
		var y = this.tileSize * (y + 1 / 2) * 1.02 + this.top;
		return new Vector2(x, y);
	}

	/**
	 * 获取绝对位置
	 */
	public getAbsPosition(x: number, y: number) {
		var pos = this.getTruePosition(x, y);
		pos.x += this.x - this.anchorOffsetX;
		pos.y += this.y - this.anchorOffsetY;
		return pos;
	}

	private get hor(): number {
		return GameData.hor;
	}

	private get ver(): number {
		return GameData.ver;
	}

	private get tileSize(): number {
		return GameData.tileSize;
	}

	private get top(): number {
		return 32;
	}
}