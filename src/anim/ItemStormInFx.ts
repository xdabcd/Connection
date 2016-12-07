/**
 *
 * 风道具出场特效
 *
 */
class ItemStormInFx extends Fx {
    public static FRAMERATE:number = 14;
    protected init() {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_storm_in"));
        this.anim.frameRate = ItemStormInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    public play() {
        super.play();
        this.anim.gotoAndPlay(1);
    }
}