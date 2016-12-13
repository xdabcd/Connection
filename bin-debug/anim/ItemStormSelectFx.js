/**
 *
 * 飓风电道具选中特效
 *
 */
var ItemStormSelectFx = (function (_super) {
    __extends(ItemStormSelectFx, _super);
    function ItemStormSelectFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemStormSelectFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_select_json");
        var mcTexture = RES.getRes("items_select_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_storm_select"));
        this.anim.frameRate = ItemStormSelectFx.FRAMERATE;
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
    ItemStormSelectFx.FRAMERATE = 8;
    return ItemStormSelectFx;
}(Fx));
egret.registerClass(ItemStormSelectFx,'ItemStormSelectFx');
//# sourceMappingURL=ItemStormSelectFx.js.map