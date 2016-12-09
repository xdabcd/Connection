/**
 *
 * 门的动画
 *
 */
var DoorFx = (function (_super) {
    __extends(DoorFx, _super);
    function DoorFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=DoorFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("door_json");
        var mcTexture = RES.getRes("door_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("door"));
        this.anim.frameRate = DoorFx.FRAMERATE;
        this.addChild(this.anim);
        // this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.playOpen = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay("open");
    };
    p.playStatic = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndStop("static");
    };
    p.playShakeClosed = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay("shake1");
    };
    p.playShakeOpened = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay("shake2");
    };
    DoorFx.FRAMERATE = 12;
    return DoorFx;
}(Fx));
egret.registerClass(DoorFx,'DoorFx');
//# sourceMappingURL=DoorFx.js.map