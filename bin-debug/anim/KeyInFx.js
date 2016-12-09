/**
 *
 * 钥匙出场特效
 *
 */
var KeyInFx = (function (_super) {
    __extends(KeyInFx, _super);
    function KeyInFx() {
        _super.apply(this, arguments);
    }
    var d = __define,c=KeyInFx,p=c.prototype;
    p.init = function () {
        var mcData = RES.getRes("items_in_json");
        var mcTexture = RES.getRes("items_in_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim = new egret.MovieClip(mcDataFactory.generateMovieClipData("key_in"));
        this.anim.frameRate = KeyInFx.FRAMERATE;
        this.addChild(this.anim);
        this.anim.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.anim.gotoAndPlay(1);
    };
    KeyInFx.FRAMERATE = 12;
    return KeyInFx;
}(Fx));
egret.registerClass(KeyInFx,'KeyInFx');
//# sourceMappingURL=KeyInFx.js.map