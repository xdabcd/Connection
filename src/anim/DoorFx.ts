/**
 *
 * 门的动画
 *
 */
class DoorFx extends Fx {
    public static FRAMERATE:number = 12;
    protected init() {
        var mcData = RES.getRes("door_json");
        var mcTexture = RES.getRes("door_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("door"));
        this.anim.frameRate = DoorFx.FRAMERATE;
        this.addChild(this.anim);
        // this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    public playOpen() {
        super.play();
        this.anim.gotoAndPlay("open");
    }

    public playStatic() {
        super.play();
        this.anim.gotoAndStop("static");
    }


    public playShakeClosed() {
        super.play();
        this.anim.gotoAndPlay("shake1");
    }

    public playShakeOpened() {
        super.play();
        this.anim.gotoAndPlay("shake2");
    }
}