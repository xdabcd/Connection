/**
 *
 * 格子数据
 *
 */
var TileData = (function () {
    function TileData() {
        /** 效果 */
        this.effect = TileEffect.NONE;
    }
    var d = __define,c=TileData,p=c.prototype;
    p.clone = function () {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.effect = this.effect;
        return data;
    };
    return TileData;
}());
egret.registerClass(TileData,'TileData');
var TileEffect;
(function (TileEffect) {
    TileEffect[TileEffect["NONE"] = 0] = "NONE";
})(TileEffect || (TileEffect = {}));
//# sourceMappingURL=TileData.js.map