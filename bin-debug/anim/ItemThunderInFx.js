/**
 *
 * 闪电道具出场特效
 *
 */
var ItemThunderInFx = (function (_super) {
    __extends(ItemThunderInFx, _super);
    function ItemThunderInFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemThunderInFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_thunder_in"));
        this.anim.frameRate = ItemThunderInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1);
    };
    ItemThunderInFx.FRAMERATE = 14;
    return ItemThunderInFx;
}(Fx));
egret.registerClass(ItemThunderInFx,'ItemThunderInFx');
//# sourceMappingURL=ItemThunderInFx.js.map