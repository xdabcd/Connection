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

	private _gridCon: egret.DisplayObjectContainer;
	private _arrowCon: egret.DisplayObjectContainer;
	private _tileCon: egret.DisplayObjectContainer;
	private _fxCon: egret.DisplayObjectContainer;
	private _hitCon: egret.DisplayObjectContainer;
	private _arrows: Array<Arrow>;

	public constructor() {
        super();
        this._controller = new GridController(this);
		KeyboardUtils.addKeyUp((key) => {
			if (key == Keyboard.SPACE) {
				TimerManager.setTimeScale(1);
			}
		}, this);
		KeyboardUtils.addKeyDown((key) => {
			if (key == Keyboard.SPACE) {
				TimerManager.setTimeScale(0.2);
			}
		}, this);
    }

    /**
     * 初始化
     */
    protected init() {
		super.init();
		this.addChild(this._bg = DisplayUtils.createBitmap("grid_bg_png"));
		this._border1 = DisplayUtils.createBitmap("grid_border_1_png");
		this._border2 = DisplayUtils.createBitmap("grid_border_2_png");
		this._bottom = DisplayUtils.createBitmap("grid_bottom_png");
		this.width = this._bg.width = this._border1.width + this._border2.width + 640;
		this.height = this._bg.height = this._border1.height;

		this.addChild(this._gridCon = new egret.DisplayObjectContainer);
		this.initGrid();

		this.addChild(this._arrowCon = new egret.DisplayObjectContainer);
		this._arrows = [];

        this.addChild(this._tileCon = new egret.DisplayObjectContainer);
		this.addChild(this._fxCon = new egret.DisplayObjectContainer);
		this.addChild(this._hitCon = new egret.DisplayObjectContainer);

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
		tile.touchEnabled = true;
		this._tileCon.addChild(tile);
		tile.setOnTouch(() => { this.tileOnTouch(tile.pos); });
	}

	/**
	 * 移除格子
	 */
	public removeTile(tileData: TileData, duration: number) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
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
			this._tileCon.removeChild(tile);
			this._hitCon.addChild(tile);
			tile.hit(direction, duration);
		}
	}

	/**
	 * 震动格子
	 */
	public shakeTile(tileData: TileData, src: TileData) {
		var tile1 = this.findTile(tileData.pos);
		var tile2 = this.findTile(src.pos);
		if (tile1 && tile2) {
			tile1.shake(tile2.x, tile2.y);
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
	 * 添加消失特效
	 */
	public addRemoveFx(removeFx: TileRemoveFx, x: number, y: number) {
		var fx: Fx;
		switch (removeFx) {
			case TileRemoveFx.Smoke:
				fx = ObjectPool.pop("SmokeFx") as SmokeFx;
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
		return;
	}

	/**
	 * 获取格子的真实位置
	 */
	private getTruePosition(x: number, y: number) {
		var x = this.width / 2 + this.tileSize * (x - this.hor / 2 + 1 / 2);
		var y = this.tileSize * (y + 1 / 2) + this.top;
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
		return 5;
	}
}