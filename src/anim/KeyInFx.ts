/**
 *
 * 钥匙出场特效
 *
 */
class KeyInFx extends Fx {
    public static FRAMERATE:number = 12;
    protected init() {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("key_in"));
        this.anim.frameRate = KeyInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    public play() {
        super.play();
        this.anim.gotoAndPlay(1);
    }
}