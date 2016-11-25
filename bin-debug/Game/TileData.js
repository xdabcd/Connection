/**
 *
 * 格子数据
 *
 */
var TileData = (function () {
    function TileData() {
        /** 效果 */
        this.effect = TileEffect.NONE;
        this._id = TileData.cnt;
        TileData.cnt += 1;
    }
    var d = __define,c=TileData,p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
    );
    p.clone = function () {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.effect = this.effect;
        return data;
    };
    TileData.cnt = 0;
    return TileData;
}());
egret.registerClass(TileData,'TileData');
var TileEffect;
(function (TileEffect) {
    TileEffect[TileEffect["NONE"] = 0] = "NONE";
    TileEffect[TileEffect["BOMB"] = 1] = "BOMB";
    TileEffect[TileEffect["CROSS"] = 2] = "CROSS";
    TileEffect[TileEffect["KIND"] = 3] = "KIND";
    TileEffect[TileEffect["RANDOM"] = 4] = "RANDOM";
})(TileEffect || (TileEffect = {}));
//# sourceMappingURL=TileData.js.map