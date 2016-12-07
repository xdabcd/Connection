/**
 *
 * 火道具出场特效
 *
 */
var ItemFireInFx = (function (_super) {
    __extends(ItemFireInFx, _super);
    function ItemFireInFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemFireInFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_fire_in"));
        this.anim.frameRate = ItemFireInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1);
    };
    ItemFireInFx.FRAMERATE = 14;
    return ItemFireInFx;
}(Fx));
egret.registerClass(ItemFireInFx,'ItemFireInFx');
//# sourceMappingURL=ItemFireInFx.js.map