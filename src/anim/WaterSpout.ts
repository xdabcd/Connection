
class WaterSpout extends egret.Sprite {

    private spout:egret.Bitmap;
    private end:egret.Bitmap;
    private end2:egret.Bitmap;

    private glow:egret.Shape;
    private glowmask:egret.Bitmap;

    public WIDTH:number=0;
    public HEIGHT:number=0;

    public constructor() {
        super();
        this.createView();
    }

    private createView():void {
        this.spout = DisplayUtils.createBitmap("waterspout_png");
        this.glowmask = DisplayUtils.createBitmap("waterspout_png");
        this.end = DisplayUtils.createBitmap("waterend_png");
        this.end2 = DisplayUtils.createBitmap("waterend_png");

        this.spout.anchorOffsetX = this.spout.width*0.5;
        this.spout.anchorOffsetY = this.spout.height;
        this.glowmask.anchorOffsetX = this.glowmask.width*0.5;
        this.glowmask.anchorOffsetY = this.glowmask.height;
        this.end.anchorOffsetX = this.end.width*0.5;
        this.end.y = -this.spout.height;
        this.end2.anchorOffsetX = this.end2.width*0.5;
        this.end2.scaleX = -1;
        this.end2.y = -this.spout.height;
        this.end2.alpha=0;

        this.WIDTH = this.end.width;
        this.HEIGHT = this.spout.height;

        this.glow = new egret.Shape();
        this.glow.graphics.beginFill(0xffffff,1);
        this.glow.graphics.drawRect(-this.end.width/2, -this.spout.height, this.end.width, this.spout.height);
        this.glow.graphics.endFill();

        this.addChild(this.spout);
        this.addChild(this.glow);
        this.addChild(this.glowmask);
        this.glow.mask = this.glowmask;
        this.glow.alpha=0;
        this.addChild(this.end);
        this.addChild(this.end2);

        egret.Tween.get(this.end,{loop:true}).to({"alpha": 0}, 50).wait(100).to({"alpha": 1}, 50).wait(100);
        egret.Tween.get(this.end2,{loop:true}).to({"alpha": 1}, 50).wait(100).to({"alpha": 0}, 50).wait(100);


    }

    public showGlow(duration:number):void{
        //egret.Tween.get(this.glow).to({"alpha": 0.5}, duration);
        var tw1 = new Tween(this.glow);
        tw1.to = {"alpha": 0.5};
        tw1.duration = duration;
        tw1.start();
    }

    public playAni():void{

    }

    public reset():void{
        this.glow.alpha=0;
    }

}
