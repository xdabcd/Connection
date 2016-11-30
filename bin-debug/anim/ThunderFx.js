/**
 *
 * 闪电特效
 *
 */
var ThunderFx = (function (_super) {
    __extends(ThunderFx, _super);
    function ThunderFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ThunderFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("thunder_json");
        var mcTexture = RES.getRes("thunder_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("thunder"));
        this.anim.frameRate = ThunderFx.TIME_ANIM;
        this.anim.gotoAndPlay(1, -1);
        this.addChild(this.anim);
        this.star = DisplayUtils.createBitmap("thunderstar_png");
        this.star.anchorOffsetX = this.star.width * 0.5;
        this.star.anchorOffsetY = this.star.height * 0.5;
        this.addChild(this.star);
    };
    p.play = function () {
        var _this = this;
        _super.prototype.play.call(this);
        this.reset();
        var tw1 = new Tween(this.anim);
        tw1.to = { "y": 0 };
        tw1.duration = ThunderFx.TIME_IN;
        tw1.start();
        var tw2 = new Tween(this.star);
        tw2.to = { "scaleX": 1, "scaleY": 1 };
        tw2.duration = ThunderFx.TIME_IN;
        tw2.callBack = function () { return _this.ani2(); };
        tw2.start();
    };
    p.ani2 = function () {
        var _this = this;
        var tw1 = new Tween(this.star);
        tw1.to = { "scaleX": 1.4, "scaleY": 1.4, "rotation": -10 };
        tw1.duration = 100;
        tw1.loop = true;
        tw1.start();
        var tw2 = new Tween(this.star);
        tw2.duration = ThunderFx.TIME_KEEP;
        tw2.callBack = function () { return _this.ani3(); };
        tw2.start();
    };
    p.ani3 = function () {
        var _this = this;
        var tw1 = new Tween(this.anim);
        tw1.to = { "scaleY": 0, "y": 30 };
        tw1.duration = ThunderFx.TIME_OUT;
        tw1.start();
        var tw2 = new Tween(this.star);
        tw2.to = { "scaleX": 0.3, "scaleY": 0.3, "rotation": -90, "alpha": 0.3 };
        tw2.duration = ThunderFx.TIME_OUT;
        tw2.callBack = function () { return _this.onComplete(); };
        tw2.start();
    };
    p.reset = function () {
        this.anim.y = -ThunderFx.HEIGHT;
        this.anim.scaleY = 1;
        this.star.scaleX = this.star.scaleY = 0.5;
        this.star.alpha = 1;
        this.star.rotation = 0;
    };
    ThunderFx.TIME_ANIM = 8;
    ThunderFx.HEIGHT = 750;
    ThunderFx.TIME_IN = 100;
    ThunderFx.TIME_KEEP = 400;
    ThunderFx.TIME_OUT = 100;
    return ThunderFx;
}(Fx));
egret.registerClass(ThunderFx,'ThunderFx');
//# sourceMappingURL=ThunderFx.js.map