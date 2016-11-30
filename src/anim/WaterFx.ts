
class WaterFx extends Fx {


    private watercenter: egret.MovieClip;
    private waterspout1: WaterSpout;
    private waterspout2: WaterSpout;
    private waterspout3: WaterSpout;
    private waterspout4: WaterSpout;

    private mask1: egret.Shape;
    private mask2: egret.Shape;
    private mask3: egret.Shape;
    private mask4: egret.Shape;


    private flyDistance: number = 0;

    public static TIME_ROTATION: number = 16;
    public static TIME_SPOUTAPPEAR: number = 400;
    public static TIME_SPOUTDISAPPEAR: number = 200;
    public static TIME_SPOUTKEEP: number = 400;

    private maskWidth: number = 0;
    private maskHeight: number = 0;

    protected init(): void {
        var mcData = RES.getRes("watercenter_json");
        var mcTexture = RES.getRes("watercenter_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.watercenter = new egret.MovieClip(mcDataFactory.generateMovieClipData("water"));
        this.watercenter.frameRate = WaterFx.TIME_ROTATION;
        this.watercenter.x = 0;
        this.watercenter.y = 0;
        this.watercenter.gotoAndPlay(1, -1);

        this.waterspout1 = new WaterSpout();
        this.waterspout2 = new WaterSpout();
        this.waterspout3 = new WaterSpout();
        this.waterspout4 = new WaterSpout();


        this.waterspout2.rotation = 90;
        this.waterspout3.rotation = 180;
        this.waterspout4.rotation = 270;

        //masks
        this.maskWidth = this.waterspout1.WIDTH + 15;
        this.maskHeight = this.waterspout1.HEIGHT + 50;
        this.mask1 = new egret.Shape();
        this.mask2 = new egret.Shape();
        this.mask3 = new egret.Shape();
        this.mask4 = new egret.Shape();
        this.mask1.graphics.beginFill(0xffffff, 1);
        this.mask1.graphics.drawRect(-this.maskWidth / 2, -this.maskHeight, this.maskWidth, this.maskHeight);
        this.mask1.graphics.endFill();
        this.mask2.graphics.beginFill(0xffffff, 1);
        this.mask2.graphics.drawRect(0, -this.maskWidth / 2, this.maskHeight, this.maskWidth);
        this.mask2.graphics.endFill();
        this.mask3.graphics.beginFill(0xffffff, 1);
        this.mask3.graphics.drawRect(-this.maskWidth / 2, 0, this.maskWidth, this.maskHeight);
        this.mask3.graphics.endFill();
        this.mask4.graphics.beginFill(0xffffff, 1);
        this.mask4.graphics.drawRect(-this.maskHeight, -this.maskWidth / 2, this.maskHeight, this.maskWidth);
        this.mask4.graphics.endFill();

        this.addChild(this.waterspout1);
        this.addChild(this.waterspout2);
        this.addChild(this.waterspout3);
        this.addChild(this.waterspout4);
        this.addChild(this.mask1);
        this.addChild(this.mask2);
        this.addChild(this.mask3);
        this.addChild(this.mask4);
        this.waterspout1.mask = this.mask1;
        this.waterspout2.mask = this.mask2;
        this.waterspout3.mask = this.mask3;
        this.waterspout4.mask = this.mask4;
        this.waterspout1.y = this.waterspout1.HEIGHT;
        this.waterspout2.x = -this.waterspout2.HEIGHT;
        this.waterspout3.y = -this.waterspout3.HEIGHT;
        this.waterspout4.x = this.waterspout4.HEIGHT;

        this.waterspout1.alpha = 0.8;
        this.waterspout1.scaleX = 0.7;
        this.waterspout2.alpha = 0.8;
        this.waterspout2.scaleX = 0.7;
        this.waterspout3.alpha = 0.8;
        this.waterspout3.scaleX = 0.7;
        this.waterspout4.alpha = 0.8;
        this.waterspout4.scaleX = 0.7;

        this.addChild(this.watercenter);
    }

    public play(): void {
        super.play();

        // egret.Tween.get(this.waterspout1).to({ "y": this.waterspout1.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 }, WaterFx.TIME_SPOUTAPPEAR);
        // egret.Tween.get(this.waterspout2).to({ "x": -this.waterspout2.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 }, WaterFx.TIME_SPOUTAPPEAR);
        // egret.Tween.get(this.waterspout3).to({ "y": -this.waterspout2.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 }, WaterFx.TIME_SPOUTAPPEAR);
        // egret.Tween.get(this.waterspout4).to({ "x": this.waterspout4.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 }, WaterFx.TIME_SPOUTAPPEAR).call(this.ani2, this);

        this.reset();

        var tw1 = new Tween(this.waterspout1);
        tw1.to = { "y": this.waterspout1.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 };
        tw1.duration = WaterFx.TIME_SPOUTAPPEAR;
        tw1.start();
        var tw2 = new Tween(this.waterspout2);
        tw2.to = { "x": -this.waterspout2.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 };
        tw2.duration = WaterFx.TIME_SPOUTAPPEAR;
        tw2.start();
        var tw3 = new Tween(this.waterspout3);
        tw3.to = { "y": -this.waterspout2.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 };
        tw3.duration = WaterFx.TIME_SPOUTAPPEAR;
        tw3.start();
        var tw4 = new Tween(this.waterspout4);
        tw4.to = { "x": this.waterspout4.HEIGHT * 0.4, "alpha": 1, "scaleX": 1, "scaleY": 1 };
        tw4.duration = WaterFx.TIME_SPOUTAPPEAR;
        tw4.callBack = () => this.ani2();
        tw4.start();

    }
    public ani2(): void {
        this.waterspout1.showGlow(WaterFx.TIME_SPOUTKEEP);
        this.waterspout2.showGlow(WaterFx.TIME_SPOUTKEEP);
        this.waterspout3.showGlow(WaterFx.TIME_SPOUTKEEP);
        this.waterspout4.showGlow(WaterFx.TIME_SPOUTKEEP);
        // egret.Tween.get(this.watercenter).to({ "alpha": 0.8 }, WaterFx.TIME_SPOUTDISAPPEAR);
        var twCenter = new Tween(this.watercenter);
        twCenter.to = { "alpha": 0.8 };
        twCenter.duration = WaterFx.TIME_SPOUTDISAPPEAR;
        twCenter.start();

        // egret.Tween.get(this.waterspout1).to({ "y": 0 }, WaterFx.TIME_SPOUTKEEP);
        // egret.Tween.get(this.waterspout2).to({ "x": 0 }, WaterFx.TIME_SPOUTKEEP);
        // egret.Tween.get(this.waterspout3).to({ "y": 0 }, WaterFx.TIME_SPOUTKEEP);
        // egret.Tween.get(this.waterspout4).to({ "x": 0 }, WaterFx.TIME_SPOUTKEEP).call(this.ani3, this);
        var tw1 = new Tween(this.waterspout1);
        tw1.to = { "y": 0 };
        tw1.duration = WaterFx.TIME_SPOUTKEEP;
        tw1.start();
        var tw2 = new Tween(this.waterspout2);
        tw2.to = { "x": 0 };
        tw2.duration = WaterFx.TIME_SPOUTKEEP;
        tw2.start();
        var tw3 = new Tween(this.waterspout3);
        tw3.to ={ "y": 0 };
        tw3.duration = WaterFx.TIME_SPOUTKEEP;
        tw3.start();
        var tw4 = new Tween(this.waterspout4);
        tw4.to = { "x": 0 };
        tw4.duration = WaterFx.TIME_SPOUTKEEP;
        tw4.callBack = () => this.ani3();
        tw4.start();

    }
    public ani3(): void {
        // egret.Tween.get(this.watercenter).to({ "alpha": 0.3, "scaleX": 0.3, "scaleY": 0.3 }, WaterFx.TIME_SPOUTDISAPPEAR);
        // egret.Tween.get(this.waterspout1).to({ "y": 0, "alpha": 0.3, "scaleX": 0.3 }, WaterFx.TIME_SPOUTDISAPPEAR);
        // egret.Tween.get(this.waterspout2).to({ "x": 0, "alpha": 0.3, "scaleX": 0.3 }, WaterFx.TIME_SPOUTDISAPPEAR);
        // egret.Tween.get(this.waterspout3).to({ "y": 0, "alpha": 0.3, "scaleX": 0.3 }, WaterFx.TIME_SPOUTDISAPPEAR);
        // egret.Tween.get(this.waterspout4).to({ "x": 0, "alpha": 0.3, "scaleX": 0.3 }, WaterFx.TIME_SPOUTDISAPPEAR).call(this.onComplete, this);


        var twCenter = new Tween(this.watercenter);
        twCenter.to = { "alpha": 0.3, "scaleX": 0.3, "scaleY": 0.3 };
        twCenter.duration = WaterFx.TIME_SPOUTDISAPPEAR;
        twCenter.start();
        var tw1 = new Tween(this.waterspout1);
        tw1.to = { "y": 0, "alpha": 0.3, "scaleX": 0.3 };
        tw1.duration = WaterFx.TIME_SPOUTDISAPPEAR;
        tw1.start();
        var tw2 = new Tween(this.waterspout2);
        tw2.to = { "x": 0, "alpha": 0.3, "scaleX": 0.3 };
        tw2.duration = WaterFx.TIME_SPOUTDISAPPEAR;
        tw2.start();
        var tw3 = new Tween(this.waterspout3);
        tw3.to ={ "y": 0, "alpha": 0.3, "scaleX": 0.3 };
        tw3.duration = WaterFx.TIME_SPOUTDISAPPEAR;
        tw3.start();
        var tw4 = new Tween(this.waterspout4);
        tw4.to = { "x": 0, "alpha": 0.3, "scaleX": 0.3 };
        tw4.duration = WaterFx.TIME_SPOUTDISAPPEAR;
        tw4.callBack = () => this.onComplete();
        tw4.start();
    }

    public reset():void{
        this.watercenter.alpha=1;
        this.watercenter.scaleX = this.watercenter.scaleY = 1;

        this.waterspout1.y=this.waterspout1.HEIGHT;
        this.waterspout2.x=-this.waterspout2.HEIGHT;
        this.waterspout3.y=-this.waterspout3.HEIGHT;
        this.waterspout4.x=this.waterspout4.HEIGHT;

        this.waterspout1.alpha=0.8;
        this.waterspout1.scaleX=0.7;
        this.waterspout2.alpha=0.8;
        this.waterspout2.scaleX=0.7;
        this.waterspout3.alpha=0.8;
        this.waterspout3.scaleX=0.7;
        this.waterspout4.alpha=0.8;
        this.waterspout4.scaleX=0.7;

        this.waterspout1.scaleX = 1;
        this.waterspout2.scaleX = 1;
        this.waterspout3.scaleX = 1;
        this.waterspout4.scaleX = 1;

        this.waterspout1.reset();
        this.waterspout2.reset();
        this.waterspout3.reset();
        this.waterspout4.reset();
    }
}
