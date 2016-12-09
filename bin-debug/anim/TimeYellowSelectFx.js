/**
 *
 * 黄色沙漏选中特效
 *
 */
var TimeYellowSelectFx = (function (_super) {
    __extends(TimeYellowSelectFx, _super);
    function TimeYellowSelectFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=TimeYellowSelectFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("time_select_json");
        var mcTexture = RES.getRes("time_select_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("time_yellow_select"));
        this.anim.frameRate = TimeYellowSelectFx.FRAMERATE;
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
    TimeYellowSelectFx.FRAMERATE = 9;
    return TimeYellowSelectFx;
}(Fx));
egret.registerClass(TimeYellowSelectFx,'TimeYellowSelectFx');
//# sourceMappingURL=TimeYellowSelectFx.js.map