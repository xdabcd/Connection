/**
 *
 * 闪电特效
 *
 */
class ThunderFx extends Fx {

    private star: egret.Bitmap;

    public static TIME_ANIM: number = 8;

    public static HEIGHT: number = 750;
    public static TIME_IN: number = 100;
    public static TIME_KEEP: number = 400;
    public static TIME_OUT: number = 100;

    protected init(): void {
        var mcData = RES.getRes("thunder_json");
        var mcTexture = RES.getRes("thunder_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("thunder"));
        this.anim.frameRate = ThunderFx.TIME_ANIM;
        this.anim.gotoAndPlay(1, -1);
        this.addChild(this.anim);

        this.star = DisplayUtils.createBitmap("thunderstar_png");
        this.star.anchorOffsetX = this.star.width * 0.5;
        this.star.anchorOffsetY = this.star.height * 0.5;
        this.addChild(this.star);
    }

    public play(): void {
        super.play();

        this.reset();

        var tw1 = new Tween(this.anim);
        tw1.to = { "y": 0 };
        tw1.duration = ThunderFx.TIME_IN;
        tw1.start();
        var tw2 = new Tween(this.star);
        tw2.to = { "scaleX": 1, "scaleY": 1 };
        tw2.duration = ThunderFx.TIME_IN;
        tw2.callBack = () => this.ani2();
        tw2.start();


    }

    private ani2(): void {
        var tw1 = new Tween(this.star);
        tw1.to = { "scaleX": 1.4, "scaleY": 1.4, "rotation": -10 };
        tw1.duration = 100;
        tw1.loop = true;
        tw1.start();

        var tw2 = new Tween(this.star);
        tw2.duration = ThunderFx.TIME_KEEP;
        tw2.callBack = () => this.ani3();
        tw2.start();
    }

    private ani3(): void {
        var tw1 = new Tween(this.anim);
        tw1.to = { "scaleY": 0, "y": 30 };
        tw1.duration = ThunderFx.TIME_OUT;
        tw1.start();
        var tw2 = new Tween(this.star);
        tw2.to = { "scaleX": 0.3, "scaleY": 0.3, "rotation": -90, "alpha": 0.3 };
        tw2.duration = ThunderFx.TIME_OUT;
        tw2.callBack = () => this.onComplete();
        tw2.start();

    }


    public reset(): void {
        this.anim.y = -ThunderFx.HEIGHT;
        this.anim.scaleY = 1;
        this.star.scaleX = this.star.scaleY = 0.5;
        this.star.alpha = 1;
        this.star.rotation = 0;
    }
}