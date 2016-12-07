/**
 *
 * 风道具出场特效
 *
 */
var ItemStormInFx = (function (_super) {
    __extends(ItemStormInFx, _super);
    function ItemStormInFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemStormInFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_storm_in"));
        this.anim.frameRate = ItemStormInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1);
    };
    ItemStormInFx.FRAMERATE = 14;
    return ItemStormInFx;
}(Fx));
egret.registerClass(ItemStormInFx,'ItemStormInFx');
//# sourceMappingURL=ItemStormInFx.js.map