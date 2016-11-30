var WaterSpout = (function (_super) {
    __extends(WaterSpout, _super);
    function WaterSpout() {
        _super.call(this);
        this.WIDTH = 0;
        this.HEIGHT = 0;
        this.createView();
    }
    var d = __define,c=WaterSpout,p=c.prototype;
    p.createView = function () {
        this.spout = DisplayUtils.createBitmap("waterspout_png");
        this.glowmask = DisplayUtils.createBitmap("waterspout_png");
        this.end = DisplayUtils.createBitmap("waterend_png");
        this.end2 = DisplayUtils.createBitmap("waterend_png");
        this.spout.anchorOffsetX = this.spout.width * 0.5;
        this.spout.anchorOffsetY = this.spout.height;
        this.glowmask.anchorOffsetX = this.glowmask.width * 0.5;
        this.glowmask.anchorOffsetY = this.glowmask.height;
        this.end.anchorOffsetX = this.end.width * 0.5;
        this.end.y = -this.spout.height;
        this.end2.anchorOffsetX = this.end2.width * 0.5;
        this.end2.scaleX = -1;
        this.end2.y = -this.spout.height;
        this.end2.alpha = 0;
        this.WIDTH = this.end.width;
        this.HEIGHT = this.spout.height;
        this.glow = new egret.Shape();
        this.glow.graphics.beginFill(0xffffff, 1);
        this.glow.graphics.drawRect(-this.end.width / 2, -this.spout.height, this.end.width, this.spout.height);
        this.glow.graphics.endFill();
        this.addChild(this.spout);
        this.addChild(this.glow);
        this.addChild(this.glowmask);
        this.glow.mask = this.glowmask;
        this.glow.alpha = 0;
        this.addChild(this.end);
        this.addChild(this.end2);
        egret.Tween.get(this.end, { loop: true }).to({ "alpha": 0 }, 50).wait(100).to({ "alpha": 1 }, 50).wait(100);
        egret.Tween.get(this.end2, { loop: true }).to({ "alpha": 1 }, 50).wait(100).to({ "alpha": 0 }, 50).wait(100);
    };
    p.showGlow = function (duration) {
        //egret.Tween.get(this.glow).to({"alpha": 0.5}, duration);
        var tw1 = new Tween(this.glow);
        tw1.to = { "alpha": 0.5 };
        tw1.duration = duration;
        tw1.start();
    };
    p.playAni = function () {
    };
    p.reset = function () {
        this.glow.alpha = 0;
    };
    return WaterSpout;
}(egret.Sprite));
egret.registerClass(WaterSpout,'WaterSpout');
//# sourceMappingURL=WaterSpout.js.map