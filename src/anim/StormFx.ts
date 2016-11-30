/**
 *
 * 飓风特效
 *
 */
class StormFx extends Fx {

    public static TIME_ANIM:number = 12;

    public static WIDTH:number = 500;
    public static TIME_MOVE:number = 1200;

    protected init():void{
        var mcData = RES.getRes("storm_json");
        var mcTexture = RES.getRes("storm_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("storm"));
        this.anim.frameRate = StormFx.TIME_ANIM;
        this.addChild(this.anim);
        this.anim.gotoAndPlay(1,-1);
    }

    public play():void{
        super.play();


        // var tw1 = new Tween(this.anim);
        // tw1.to = {"x": StageUtils.stageW-StormFx.WIDTH/2};
        // tw1.duration = StormFx.TIME_MOVE;
        // tw1.start();
        var tw2 = new Tween(this.anim);
        tw2.to = {"x": StageUtils.stageW+StormFx.WIDTH/2};
        tw2.duration = StormFx.TIME_MOVE;
        // tw2.delay = StormFx.TIME_MOVE;
        tw2.callBack = () => this.onComplete();
        tw2.start();


    }

    public reset():void{
        this.anim.x = 0;
    }
}