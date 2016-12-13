/**
 *
 * 飓风电道具选中特效
 *
 */
class ItemStormSelectFx extends Fx {
    public static FRAMERATE: number = 8;
    protected init() {
        var mcData = RES.getRes("items_select_json");
        var mcTexture = RES.getRes("items_select_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("item_storm_select"));
        this.anim.frameRate = ItemStormSelectFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onNextAnim, this);
    }

    public play() {
        super.play();
        this.anim.play();
    }

    public onNextAnim(e: egret.Event): void {
        this.anim.gotoAndPlay("loop", -1);
    }

    public stopAtFirstFrame() {
        super.stopAtFirstFrame();
        this.anim.gotoAndStop(1);
    }
}