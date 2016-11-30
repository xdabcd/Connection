/**
 * 
 * 烟雾特效
 * 
 */
class SmokeFx extends Fx {
	protected init() {
		var mcData = RES.getRes("smoke_json");
        var mcTexture = RES.getRes("smoke_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
		this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("smoke"));
        this.anim.frameRate = WaterFx.TIME_ROTATION;
		this.addChild(this.anim);
		this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
	}

	public play() {
		super.play();
		this.anim.gotoAndPlay(1);
	}
}