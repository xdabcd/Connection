/**
 *
 * 火焰特效
 *
 */
class FireFx extends Fx {

    private bitmapArray:Array<egret.Bitmap>;

    public static TIME_DISAPPEAR:number = 200;

    public static FRAMERATE:number = 8;
    public static TOTALFRAME:number = 6;

    private timecount:number=0;
    private currentFrameIndex:number=0;

    protected init():void{
        this.bitmapArray = new Array();
        for(var i=1; i<FireFx.TOTALFRAME+1; i++)
        {
            var bb = DisplayUtils.createBitmap("fire000"+i+"_png");
            this.bitmapArray.push(bb);
            this.addChild(bb);
            bb.y=bb.height;
            bb.x = -bb.width/2;
        }
    }

    public play():void{
        super.play();
        this.reset();


    }

    public stopAni():void{
        var tw1 = new Tween(this);
        tw1.to = {"y": this.anim[0].height+StageUtils.stageH};
        tw1.duration = FireFx.TIME_DISAPPEAR;
        tw1.callBack = () => this.onComplete();
        tw1.start();

        egret.Tween.get(this).to({"y": this.anim[0].height+this.stage.stageHeight}, FireFx.TIME_DISAPPEAR).call(this.onComplete,this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);

    }

    public reset():void{
        for(var i=0; i<FireFx.TOTALFRAME; i++)
        {
            this.bitmapArray[i].x = -this.bitmapArray[i].width/2;
            this.bitmapArray[i].y = -this.bitmapArray[i].height;
            this.bitmapArray[i].visible=false;
        }
        this.bitmapArray[0].visible=true;

        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        // this.bitmapArray.y = this.y;
    }

    public onEnterFrame(e:egret.Event):void{
        this.timecount++;
        if(this.timecount%(Math.round(60/FireFx.FRAMERATE))==0){
            this.timecount=0;
            for(var i=0; i<FireFx.TOTALFRAME; i++) {
                this.bitmapArray[i].visible=false;
            }
            this.bitmapArray[this.currentFrameIndex].visible=true;
            this.currentFrameIndex++;
            if(this.currentFrameIndex>FireFx.TOTALFRAME-1)
                this.currentFrameIndex=0;
        }
    }
}