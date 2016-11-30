/**
 *
 * 特效
 *
 */
var Fx = (function (_super) {
    __extends(Fx, _super);
    function Fx() {
        _super.call(this);
        this.init();
        TimerManager.doFrame(1, 0, this.update, this);
    }
    var d = __define,c=Fx,p=c.prototype;
    p.init = function () {
    };
    p.update = function (delta) {
        if (this.anim) {
            if (!this._fr) {
                this._fr = this.anim.frameRate;
            }
            else {
                this.anim.frameRate = TimerManager.getTimeScale() * this._fr;
            }
        }
    };
    p.play = function () {
        this.visible = true;
    };
    p.setCallBack = function (func) {
        this._callBack = func;
    };
    p.onComplete = function () {
        this.visible = false;
        if (this._callBack) {
            this._callBack();
        }
    };
    return Fx;
}(egret.Sprite));
egret.registerClass(Fx,'Fx');
//# sourceMappingURL=Fx.js.map