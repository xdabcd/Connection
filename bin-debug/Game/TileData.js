/**
 *
 * 格子数据
 *
 */
var TileData = (function () {
    function TileData() {
        /** 效果 */
        this.effect = TileEffect.NONE;
        /** 消失效果 */
        this.removeFx = TileRemoveFx.Smoke;
        this.info = null;
        /** 钥匙 */
        this.key = false;
        /** 时间 */
        this.time = false;
        /** 倍数 */
        this.times = 0;
        /** 燃烧状态 */
        this.isFire = false;
    }
    var d = __define,c=TileData,p=c.prototype;
    p.clone = function () {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.effect = this.effect;
        data.info = this.info;
        data.key = this.key;
        data.time = this.time;
        data.times = this.times;
        data.isFire = this.isFire;
        return data;
    };
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
var TileRemoveFx;
(function (TileRemoveFx) {
    TileRemoveFx[TileRemoveFx["Smoke"] = 0] = "Smoke";
    TileRemoveFx[TileRemoveFx["Bomb"] = 1] = "Bomb";
    TileRemoveFx[TileRemoveFx["Thunder"] = 3] = "Thunder";
})(TileRemoveFx || (TileRemoveFx = {}));
//# sourceMappingURL=TileData.js.map