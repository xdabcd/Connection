/**
 *
 * 飓风特效
 *
 */
var StormFx = (function (_super) {
    __extends(StormFx, _super);
    function StormFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=StormFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("storm_json");
        var mcTexture = RES.getRes("storm_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("storm"));
        this.anim.frameRate = StormFx.TIME_ANIM;
        this.addChild(this.anim);
        this.anim.gotoAndPlay(1, -1);
    };
    p.play = function () {
        var _this = this;
        _super.prototype.play.call(this);
        // var tw1 = new Tween(this.anim);
        // tw1.to = {"x": StageUtils.stageW-StormFx.WIDTH/2};
        // tw1.duration = StormFx.TIME_MOVE;
        // tw1.start();
        var tw2 = new Tween(this.anim);
        tw2.to = { "x": StageUtils.stageW + StormFx.WIDTH / 2 };
        tw2.duration = StormFx.TIME_MOVE;
        // tw2.delay = StormFx.TIME_MOVE;
        tw2.callBack = function () { return _this.onComplete(); };
        tw2.start();
    };
    p.reset = function () {
        this.anim.x = 0;
    };
    StormFx.TIME_ANIM = 12;
    StormFx.WIDTH = 500;
    StormFx.TIME_MOVE = 1200;
    return StormFx;
}(Fx));
egret.registerClass(StormFx,'StormFx');
//# sourceMappingURL=StormFx.js.map