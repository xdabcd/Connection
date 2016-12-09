/**
 *
 * 红色沙漏选中特效
 *
 */
var TimeRedSelectFx = (function (_super) {
    __extends(TimeRedSelectFx, _super);
    function TimeRedSelectFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=TimeRedSelectFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("time_select_json");
        var mcTexture = RES.getRes("time_select_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("time_red_select"));
        this.anim.frameRate = TimeRedSelectFx.FRAMERATE;
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
    TimeRedSelectFx.FRAMERATE = 9;
    return TimeRedSelectFx;
}(Fx));
egret.registerClass(TimeRedSelectFx,'TimeRedSelectFx');
//# sourceMappingURL=TimeRedSelectFx.js.map