
class BombElement extends egret.Sprite {

    private f1: egret.Bitmap;
    private f2: egret.Bitmap;
    private f3: egret.Bitmap;
    private f4: egret.Bitmap;
    private f5: egret.Bitmap;
    private f6: egret.Bitmap;
    private f7: egret.Bitmap;
    private f8: egret.Bitmap;

    private flyDistance: number = 0;
    public WIDTH: number = 0;
    public HEIGHT: number = 0;
    public static TIME_ROTATION: number = 400;
    public constructor() {
        super();
        this.createView();
    }

    private createView(): void {
        this.f1 = DisplayUtils.createBitmap("fireparticle_png");
        this.f2 = DisplayUtils.createBitmap("fireparticle_png");
        this.f3 = DisplayUtils.createBitmap("fireparticle_png");
        this.f4 = DisplayUtils.createBitmap("fireparticle_png");

        this.flyDistance = this.f1.width / 2;
        this.WIDTH = this.f1.width;
        this.HEIGHT = this.f1.height;

        this.f1.anchorOffsetX = this.f1.width * 0.5;
        this.f1.anchorOffsetY = this.f1.height * 0.5;
        this.f2.anchorOffsetX = this.f2.width * 0.5;
        this.f2.anchorOffsetY = this.f2.height * 0.5;
        this.f3.anchorOffsetX = this.f3.width * 0.5;
        this.f3.anchorOffsetY = this.f3.height * 0.5;
        this.f4.anchorOffsetX = this.f4.width * 0.5;
        this.f4.anchorOffsetY = this.f4.height * 0.5;


        this.f2.scaleX = this.f2.scaleY = 0.5;
        this.f3.scaleX = this.f3.scaleY = 0.5;
        this.f4.scaleX = this.f4.scaleY = 0.5;

        this.addChild(this.f2);
        this.addChild(this.f3);
        this.addChild(this.f4);
        this.addChild(this.f1);



    }

    public playAni(): void {
        var tw1 = new Tween(this.f1);
        tw1.to = { "x": -this.flyDistance, "y": -this.flyDistance, "alpha": 0.2, "rotation": -180 };
        tw1.duration = BombElement.TIME_ROTATION;
        tw1.ease = TweenEase.CircOut;
        tw1.start();
        var tw2 = new Tween(this.f2, tw1);
        tw2.to = { "x": this.flyDistance, "y": this.flyDistance, "alpha": 0.2, "rotation": -180 };
        tw2.start();
        var tw3 = new Tween(this.f3, tw1);
        tw3.to = { "x": -this.flyDistance, "y": this.flyDistance, "alpha": 0.2, "rotation": -180 };
        tw3.start();
        var tw4 = new Tween(this.f4, tw1);
        tw4.to = { "x": this.flyDistance, "y": -this.flyDistance, "alpha": 0.2, "rotation": -180 };
        tw4.callBack = () => this.done();
        tw4.start();
    }

    public reset():void{
        this.f1.x=0;this.f1.y=0;
        this.f1.alpha=1;
        this.f1.rotation=0;
        this.f2.x=0;this.f2.y=0;
        this.f2.alpha=1;
        this.f2.rotation=0;
        this.f3.x=0;this.f3.y=0;
        this.f3.alpha=1;
        this.f3.rotation=0;
        this.f4.x=0;this.f4.y=0;
        this.f4.alpha=1;
        this.f4.rotation=0;
    }
    
    public done(): void {
        this.dispatchEvent(new egret.Event("aniDone"));
    }
}
