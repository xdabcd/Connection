/**
 *
 * 红色沙漏选中特效
 *
 */
class TimeRedSelectFx extends Fx {
    public static FRAMERATE:number = 9;
    protected init() {
        var mcData = RES.getRes("time_select_json");
        var mcTexture = RES.getRes("time_select_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("time_red_select"));
        this.anim.frameRate = TimeRedSelectFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    public play() {
        super.play();
        this.anim.gotoAndPlay(1, -1);
    }

    public stopAtFirstFrame() {
        super.stopAtFirstFrame();
        this.anim.gotoAndStop(1);
    }
}