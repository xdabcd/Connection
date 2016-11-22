/**
 *
 * 棋盘
 *
 */
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.call(this);
        this._size = 560;
        this._controller = new GridController(this);
    }
    var d = __define,c=Grid,p=c.prototype;
    /**
     * 初始化
     */
    p.init = function () {
        _super.prototype.init.call(this);
        this.addChild(this._tileCon = new egret.DisplayObjectContainer);
        this.width = this.height = this._size;
        AnchorUtils.setAnchor(this, 0.5);
        StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
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
            tile.remove(duration);
        }
    };
    /**
     * 选中格子
     */
    p.selectTile = function (tileData) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            tile.select();
        }
    };
    /**
     * 取消选中格子
     */
    p.unselectTile = function (tileData) {
        var tile = this.findTile(tileData.pos);
        if (tile) {
            tile.unselect();
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
        var x = x * this._size / this.hor;
        var y = y * this._size / this.ver;
        return new Vector2(x, y);
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
    return Grid;
}(BaseScene));
egret.registerClass(Grid,'Grid');
//# sourceMappingURL=Grid.js.map