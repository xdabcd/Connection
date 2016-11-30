/**
 *
 * 烟雾特效
 *
 */
var SmokeFx = (function (_super) {
    __extends(SmokeFx, _super);
    function SmokeFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=SmokeFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("smoke_json");
        var mcTexture = RES.getRes("smoke_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("smoke"));
        this.anim.frameRate = WaterFx.TIME_ROTATION;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1);
    };
    return SmokeFx;
}(Fx));
egret.registerClass(SmokeFx,'SmokeFx');
//# sourceMappingURL=SmokeFx.js.map