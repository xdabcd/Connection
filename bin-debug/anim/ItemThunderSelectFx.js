/**
 *
 * 闪电道具选中特效
 *
 */
var ItemThunderSelectFx = (function (_super) {
    __extends(ItemThunderSelectFx, _super);
    function ItemThunderSelectFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemThunderSelectFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_select_json");
        var mcTexture = RES.getRes("items_select_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_thunder_select"));
        this.anim.frameRate = ItemThunderSelectFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onNextAnim, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.play();
    };
    p.onNextAnim = function (e) {
        this.anim.gotoAndPlay("loop", -1);
    };
    p.stopAtFirstFrame = function () {
        _super.prototype.stopAtFirstFrame.call(this);
        this.anim.gotoAndStop(1);
    };
    ItemThunderSelectFx.FRAMERATE = 8;
    return ItemThunderSelectFx;
}(Fx));
egret.registerClass(ItemThunderSelectFx,'ItemThunderSelectFx');
//# sourceMappingURL=ItemThunderSelectFx.js.map