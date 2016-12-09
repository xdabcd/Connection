/**
 *
 * 火焰特效
 *
 */
var FireFx = (function (_super) {
    __extends(FireFx, _super);
    function FireFx() {
        _super.apply(this, arguments);
        this.timecount = 0;
        this.currentFrameIndex = 0;
    }
    var d = __define,c=FireFx,p=c.prototype;
    p.init = function () {
        this.bitmapArray = new Array();
        for (var i = 1; i < FireFx.TOTALFRAME + 1; i++) {
            var bb = DisplayUtils.createBitmap("fire000" + i + "_png");
            this.bitmapArray.push(bb);
            this.addChild(bb);
            bb.y = bb.height;
            bb.x = -bb.width / 2;
        }
    };
    p.play = function () {
        _super.prototype.play.call(this);
        this.reset();
    };
    p.stopAni = function () {
        var _this = this;
        var tw1 = new Tween(this);
        tw1.to = { "y": this.anim[0].height + StageUtils.stageH };
        tw1.duration = FireFx.TIME_DISAPPEAR;
        tw1.callBack = function () { return _this.onComplete(); };
        tw1.start();
        egret.Tween.get(this).to({ "y": this.anim[0].height + this.stage.stageHeight }, FireFx.TIME_DISAPPEAR).call(this.onComplete, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    p.reset = function () {
        for (var i = 0; i < FireFx.TOTALFRAME; i++) {
            this.bitmapArray[i].x = -this.bitmapArray[i].width / 2;
            this.bitmapArray[i].y = -this.bitmapArray[i].height;
            this.bitmapArray[i].visible = false;
        }
        this.bitmapArray[0].visible = true;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        // this.bitmapArray.y = this.y;
    };
    p.onEnterFrame = function (e) {
        this.timecount++;
        if (this.timecount % (Math.round(60 / FireFx.FRAMERATE)) == 0) {
            this.timecount = 0;
            for (var i = 0; i < FireFx.TOTALFRAME; i++) {
                this.bitmapArray[i].visible = false;
            }
            this.bitmapArray[this.currentFrameIndex].visible = true;
            this.currentFrameIndex++;
            if (this.currentFrameIndex > FireFx.TOTALFRAME - 1)
                this.currentFrameIndex = 0;
        }
    };
    FireFx.TIME_DISAPPEAR = 200;
    FireFx.FRAMERATE = 8;
    FireFx.TOTALFRAME = 6;
    return FireFx;
}(Fx));
egret.registerClass(FireFx,'FireFx');
//# sourceMappingURL=FireFx.js.map