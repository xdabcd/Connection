var BombFx = (function (_super) {
    __extends(BombFx, _super);
    function BombFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=BombFx,p=c.prototype;
    p.init = function () {
        this.f1 = new BombElement();
        this.f2 = new BombElement();
        this.f3 = new BombElement();
        this.f4 = new BombElement();
        this.f5 = new BombElement();
        this.f6 = new BombElement();
        this.f7 = new BombElement();
        this.f8 = new BombElement();
        this.glowF = DisplayUtils.createBitmap("fireparticle_png");
        this.white = new egret.Shape();
        this.white.graphics.beginFill(0xffffff, 1);
        this.white.graphics.drawRect(-this.glowF.width, -this.glowF.height, this.glowF.width * 2, this.glowF.height * 2);
        this.white.graphics.endFill();
        this.glowF.x = -this.glowF.width / 2;
        this.glowF.y = -this.glowF.height / 2;
        BombFx.FLYDISTANCE = this.f1.WIDTH;
        //
        // this.f1.anchorOffsetX = this.f1.WIDTH*0.5;
        // this.f1.anchorOffsetY = this.f1.HEIGHT*0.5;
        // this.f2.anchorOffsetX = this.f2.WIDTH*0.5;
        // this.f2.anchorOffsetY = this.f2.HEIGHT*0.5;
        // this.f3.anchorOffsetX = this.f3.WIDTH*0.5;
        // this.f3.anchorOffsetY = this.f3.HEIGHT*0.5;
        // this.f4.anchorOffsetX = this.f4.WIDTH*0.5;
        // this.f4.anchorOffsetY = this.f4.HEIGHT*0.5;
        // this.f5.anchorOffsetX = this.f5.WIDTH*0.5;
        // this.f5.anchorOffsetY = this.f5.HEIGHT*0.5;
        // this.f6.anchorOffsetX = this.f6.WIDTH*0.5;
        // this.f6.anchorOffsetY = this.f6.HEIGHT*0.5;
        // this.f7.anchorOffsetX = this.f7.WIDTH*0.5;
        // this.f7.anchorOffsetY = this.f7.HEIGHT*0.5;
        // this.f8.anchorOffsetX = this.f8.WIDTH*0.5;
        // this.f8.anchorOffsetY = this.f8.HEIGHT*0.5;
        this.f5.scaleX = this.f5.scaleY = 0.5;
        this.f6.scaleX = this.f6.scaleY = 0.5;
        this.f7.scaleX = this.f7.scaleY = 0.5;
        this.f8.scaleX = this.f8.scaleY = 0.5;
        this.addChild(this.f2);
        this.addChild(this.f3);
        this.addChild(this.f4);
        this.addChild(this.f5);
        this.addChild(this.f6);
        this.addChild(this.f7);
        this.addChild(this.f8);
        this.addChild(this.f1);
        this.addChild(this.white);
        this.addChild(this.glowF);
        this.white.mask = this.glowF;
        this.f8.addEventListener("aniDone", this.onComplete, this);
    };
    p.play = function () {
        var _this = this;
        _super.prototype.play.call(this);
        this.reset();
        var twWhite = new Tween(this.white);
        twWhite.to = { "rotation": -90, "alpha": 0 };
        twWhite.duration = BombFx.TIME_ROTATION;
        twWhite.ease = TweenEase.CircIn;
        twWhite.start();
        var tw1 = new Tween(this.f1);
        tw1.to = { "rotation": -90 };
        tw1.duration = BombFx.TIME_ROTATION;
        tw1.ease = TweenEase.CircIn;
        tw1.start();
        var tw2 = new Tween(this.f2, tw1);
        tw2.start();
        var tw3 = new Tween(this.f3, tw1);
        tw3.start();
        var tw4 = new Tween(this.f4, tw1);
        tw4.start();
        var tw5 = new Tween(this.f5, tw1);
        tw5.start();
        var tw6 = new Tween(this.f6, tw1);
        tw6.start();
        var tw7 = new Tween(this.f7, tw1);
        tw7.start();
        var tw8 = new Tween(this.f8, tw1);
        tw8.callBack = function () { return _this.ani2(); };
        tw8.start();
        //c
        // console.log("dfdf")
        // egret.Tween.get(this.white).to({"rotation": -90,"alpha":0}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f1).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f2).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f3).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f4).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f5).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f6).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f7).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn);
        // egret.Tween.get(this.f8).to({"rotation": -90}, BombFx.TIME_ROTATION,egret.Ease.circIn).call(this.ani2,this);
    };
    p.ani2 = function () {
        var _this = this;
        var tw1 = new Tween(this.f1);
        tw1.to = { "x": -BombFx.FLYDISTANCE };
        tw1.duration = BombFx.TIME_FLY;
        tw1.ease = TweenEase.CircIn;
        tw1.start();
        var tw2 = new Tween(this.f2, tw1);
        tw2.to = { "y": BombFx.FLYDISTANCE };
        tw2.start();
        var tw3 = new Tween(this.f3, tw1);
        tw3.to = { "x": BombFx.FLYDISTANCE };
        tw3.start();
        var tw4 = new Tween(this.f4, tw1);
        tw4.to = { "y": -BombFx.FLYDISTANCE };
        tw4.start();
        var tw5 = new Tween(this.f5, tw1);
        tw5.to = { "x": -BombFx.FLYDISTANCE, "y": -BombFx.FLYDISTANCE };
        tw5.start();
        var tw6 = new Tween(this.f6, tw1);
        tw6.to = { "x": BombFx.FLYDISTANCE, "y": BombFx.FLYDISTANCE };
        tw6.start();
        var tw7 = new Tween(this.f7, tw1);
        tw7.to = { "x": -BombFx.FLYDISTANCE, "y": BombFx.FLYDISTANCE };
        tw7.start();
        var tw8 = new Tween(this.f8, tw1);
        tw8.to = { "x": BombFx.FLYDISTANCE, "y": -BombFx.FLYDISTANCE };
        tw8.callBack = function () { return _this.ani3(); };
        tw8.start();
        // egret.Tween.get(this.f1).to({"x": -this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f2).to({"y": this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f3).to({"x": this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f4).to({"y": -this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f5).to({"x": -this.flyDistance,"y":-this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f6).to({"x": this.flyDistance,"y":this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f7).to({"x": -this.flyDistance,"y":this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn);
        // egret.Tween.get(this.f8).to({"x": this.flyDistance,"y":-this.flyDistance}, BombFx.TIME_FLY,egret.Ease.circIn).call(this.ani3,this);
    };
    p.ani3 = function () {
        this.f1.playAni();
        this.f2.playAni();
        this.f3.playAni();
        this.f4.playAni();
        this.f5.playAni();
        this.f6.playAni();
        this.f7.playAni();
        this.f8.playAni();
    };
    p.reset = function () {
        this.f1.x = 0;
        this.f1.y = 0;
        this.f2.x = 0;
        this.f2.y = 0;
        this.f3.x = 0;
        this.f3.y = 0;
        this.f4.x = 0;
        this.f4.y = 0;
        this.f5.x = 0;
        this.f5.y = 0;
        this.f6.x = 0;
        this.f6.y = 0;
        this.f7.x = 0;
        this.f7.y = 0;
        this.f8.x = 0;
        this.f8.y = 0;
        this.f1.reset();
        this.f2.reset();
        this.f3.reset();
        this.f4.reset();
        this.f5.reset();
        this.f6.reset();
        this.f7.reset();
        this.f8.reset();
        this.f1.scaleX = this.f1.scaleY = 1;
        this.f2.scaleX = this.f2.scaleY = 1;
        this.f3.scaleX = this.f3.scaleY = 1;
        this.f4.scaleX = this.f4.scaleY = 1;
        this.f5.scaleX = this.f5.scaleY = 0.5;
        this.f6.scaleX = this.f6.scaleY = 0.5;
        this.f7.scaleX = this.f7.scaleY = 0.5;
        this.f8.scaleX = this.f8.scaleY = 0.5;
        this.f1.rotation = 0;
        this.f2.rotation = 0;
        this.f3.rotation = 0;
        this.f4.rotation = 0;
        this.f5.rotation = 0;
        this.f6.rotation = 0;
        this.f7.rotation = 0;
        this.f8.rotation = 0;
        this.white.rotation = 0;
        this.white.alpha = 1;
    };
    BombFx.FLYDISTANCE = 0;
    BombFx.TIME_ROTATION = 100;
    BombFx.TIME_FLY = 200;
    return BombFx;
}(Fx));
egret.registerClass(BombFx,'BombFx');
//# sourceMappingURL=BombFx.js.map