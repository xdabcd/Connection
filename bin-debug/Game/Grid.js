/**
 *
 * 棋盘
 *
 */
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.call(this);
        this._controller = new GridController(this);
        KeyboardUtils.addKeyUp(function (key) {
            if (key == Keyboard.SPACE) {
                TimerManager.setTimeScale(1);
            }
        }, this);
        KeyboardUtils.addKeyDown(function (key) {
            if (key == Keyboard.SPACE) {
                TimerManager.setTimeScale(0.2);
            }
        }, this);
    }
    var d = __define,c=Grid,p=c.prototype;
    /**
     * 初始化
     */
    p.init = function () {
        _super.prototype.init.call(this);
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
    };
    /**
     * 初始化网格
     */
    p.initGrid = function () {
        for (var x = 0; x < this.hor; x++) {
            for (var y = 0; y < this.ver; y++) {
                if ((x + y) % 2) {
                    var tp = this.getTruePosition(x, y);
                    var g = DisplayUtils.createBitmap("gem_bg_1_png");
                    AnchorUtils.setAnchor(g, 0.5);
                    g.x = tp.x;
                    g.y = tp.y;
                    this._gridCon.addChild(g);
                }
            }
        }
    };
    /**
     * 创建格子
     */
    p.createTile = function (tileData) {
        var _this = this;
        var pos = tileData.pos;
        var tile = ObjectPool.pop("Tile");
        tile.reset();
        tile.pos = pos.clone();
        var tp = this.getTruePosition(pos.x, pos.y);
        tile.x = tp.x;
        tile.y = tp.y;
        tile.type = tileData.type;
        tile.effect = tileData.effect;
        tile.touchEnabled = true;
        this._tileCon.addChild(tile);
        tile.setOnTouch(function () { _this.tileOnTouch(tile.pos); });
    };
    /**
     * 移除格子
     */
    p.removeTile = function (tileData, duration) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            if (tileData.effect != TileEffect.NONE) {
                this.addEffect(tileData.effect, tile.x, tile.y);
            }
            else {
                this.addRemoveFx(tileData.removeFx, tile.x, tile.y);
            }
            tile.remove(duration);
        }
    };
    /**
     * 击中格子
     */
    p.hitTile = function (tileData, duration, direction) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            this._tileCon.removeChild(tile);
            this._hitCon.addChild(tile);
            tile.hit(direction, duration);
        }
    };
    /**
     * 震动格子
     */
    p.shakeTile = function (tileData, src) {
        var tile1 = this.findTile(tileData.pos);
        var tile2 = this.findTile(src.pos);
        if (tile1 && tile2) {
            tile1.shake(tile2.x, tile2.y);
        }
    };
    /**
     * 标记格子
     */
    p.signTiles = function (arr) {
        for (var i = 0; i < this._tileCon.numChildren; i++) {
            var tile = this._tileCon.getChildAt(i);
            var f = false;
            for (var j = 0; j < arr.length; j++) {
                if (tile.pos.equalTo(arr[j].pos)) {
                    f = true;
                }
            }
            tile.sign = f;
        }
    };
    /**
     * 连接格子
     */
    p.connectTile = function (src, dest, hl) {
        var tile1 = this.findTile(src.pos);
        var tile2 = this.findTile(dest.pos);
        if (tile2) {
            tile2.select(hl);
            if (tile1) {
                this.addArrow(tile1.x, tile1.y, tile2.x, tile2.y);
            }
        }
    };
    /**
     * 选中格子
     */
    p.selectTile = function (tileData, hl) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            tile.select(hl);
        }
    };
    /**
     * 取消选中格子
     */
    p.unselectTile = function (tileData) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            tile.unselect();
            this.delArrow();
        }
    };
    /**
     * 移动格子
     */
    p.moveTile = function (moveInfo) {
        var tileData = moveInfo.tileData;
        var target = moveInfo.target;
        var duration = moveInfo.duration;
        var tile = this.findTile(tileData.pos);
        if (tile) {
            var targetPos = this.getTruePosition(target.x, target.y);
            tile.moveTo(targetPos, duration, function () {
                tile.pos = target.clone();
            });
        }
    };
    /**
     * 改变格子效果
     */
    p.changeTileEffect = function (tileData) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            tile.effect = tileData.effect;
        }
    };
    /**
     * 改变格子效果
     */
    p.changeTileType = function (tileData) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            tile.type = tileData.type;
        }
    };
    /**
     * 添加消失特效
     */
    p.addRemoveFx = function (removeFx, x, y) {
        var fx;
        switch (removeFx) {
            case TileRemoveFx.Smoke:
                fx = ObjectPool.pop("SmokeFx");
                break;
            case TileRemoveFx.Thunder:
                fx = ObjectPool.pop("ThunderFx");
                break;
        }
        fx.x = x;
        fx.y = y;
        this._fxCon.addChild(fx);
        fx.play();
    };
    /**
     * 添加效果
     */
    p.addEffect = function (effect, x, y) {
        var fx;
        switch (effect) {
            case TileEffect.BOMB:
                fx = ObjectPool.pop("BombFx");
                break;
            case TileEffect.CROSS:
                fx = ObjectPool.pop("WaterFx");
                break;
            case TileEffect.KIND:
                fx = ObjectPool.pop("ThunderFx");
                break;
            case TileEffect.RANDOM:
                fx = ObjectPool.pop("StormFx");
                var tr = this.getTruePosition(0, this.hor);
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
    };
    /**
     * 添加箭头
     */
    p.addArrow = function (x1, y1, x2, y2) {
        var arrow = ObjectPool.pop("Arrow");
        arrow.x = (x1 + x2) / 2;
        arrow.y = (y1 + y2) / 2;
        arrow.rotation = MathUtils.getAngle(MathUtils.getRadian2(x1, y1, x2, y2));
        this._arrowCon.addChild(arrow);
        this._arrows.push(arrow);
    };
    /**
     * 删除箭头
     */
    p.delArrow = function () {
        if (this._arrows.length) {
            this._arrows.pop().destroy();
        }
    };
    /**
     * 格子触摸回调
     */
    p.tileOnTouch = function (pos) {
        this.applyFunc(GridCmd.TOUCH_TILE, pos);
    };
    /**
     * 触摸结束回调
     */
    p.onEnd = function (event) {
        this.applyFunc(GridCmd.TOUCH_END);
    };
    /**
     * 找到对应位置的格子
     */
    p.findTile = function (pos) {
        for (var i = 0; i < this._tileCon.numChildren; i++) {
            var tile = this._tileCon.getChildAt(i);
            if (tile.pos.equalTo(pos)) {
                return tile;
            }
        }
        return;
    };
    /**
     * 获取格子的真实位置
     */
    p.getTruePosition = function (x, y) {
        var x = this.width / 2 + this.tileSize * (x - this.hor / 2 + 1 / 2);
        var y = this.tileSize * (y + 1 / 2) + this.top;
        return new Vector2(x, y);
    };
    /**
     * 获取绝对位置
     */
    p.getAbsPosition = function (x, y) {
        var pos = this.getTruePosition(x, y);
        pos.x += this.x - this.anchorOffsetX;
        pos.y += this.y - this.anchorOffsetY;
        return pos;
    };
    d(p, "hor"
        ,function () {
            return GameData.hor;
        }
    );
    d(p, "ver"
        ,function () {
            return GameData.ver;
        }
    );
    d(p, "tileSize"
        ,function () {
            return GameData.tileSize;
        }
    );
    d(p, "top"
        ,function () {
            return 5;
        }
    );
    return Grid;
}(BaseScene));
egret.registerClass(Grid,'Grid');
//# sourceMappingURL=Grid.js.map