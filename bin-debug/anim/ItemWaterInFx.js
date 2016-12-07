/**
 *
 * 水道具出场特效
 *
 */
var ItemWaterInFx = (function (_super) {
    __extends(ItemWaterInFx, _super);
    function ItemWaterInFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemWaterInFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_water_in"));
        this.anim.frameRate = ItemWaterInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1);
    };
    ItemWaterInFx.FRAMERATE = 14;
    return ItemWaterInFx;
}(Fx));
egret.registerClass(ItemWaterInFx,'ItemWaterInFx');
//# sourceMappingURL=ItemWaterInFx.js.map