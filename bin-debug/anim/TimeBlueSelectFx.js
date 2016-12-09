/**
 *
 * 蓝色沙漏选中特效
 *
 */
var TimeBlueSelectFx = (function (_super) {
    __extends(TimeBlueSelectFx, _super);
    function TimeBlueSelectFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=TimeBlueSelectFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("time_select_json");
        var mcTexture = RES.getRes("time_select_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("time_blue_select"));
        this.anim.frameRate = TimeBlueSelectFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1, -1);
    };
    p.stopAtFirstFrame = function () {
        _super.prototype.stopAtFirstFrame.call(this);
        this.anim.gotoAndStop(1);
    };
    TimeBlueSelectFx.FRAMERATE = 9;
    return TimeBlueSelectFx;
}(Fx));
egret.registerClass(TimeBlueSelectFx,'TimeBlueSelectFx');
//# sourceMappingURL=TimeBlueSelectFx.js.map