/**
 *
 * 绿色沙漏选中特效
 *
 */
var TimeGreenSelectFx = (function (_super) {
    __extends(TimeGreenSelectFx, _super);
    function TimeGreenSelectFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=TimeGreenSelectFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("time_select_json");
        var mcTexture = RES.getRes("time_select_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("time_green_select"));
        this.anim.frameRate = TimeGreenSelectFx.FRAMERATE;
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
    TimeGreenSelectFx.FRAMERATE = 9;
    return TimeGreenSelectFx;
}(Fx));
egret.registerClass(TimeGreenSelectFx,'TimeGreenSelectFx');
//# sourceMappingURL=TimeGreenSelectFx.js.map