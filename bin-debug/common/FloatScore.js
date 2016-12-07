/**
 *
 * 浮动得分
 *
 */
var FloatScore = (function (_super) {
    __extends(FloatScore, _super);
    function FloatScore() {
        _super.call(this);
        this.addChild(this._text = new Label);
        this._text.width = 400;
        this._text.size = 45;
        this._text.stroke = 3;
        AnchorUtils.setAnchorX(this._text, 0.5);
    }
    var d = __define,c=FloatScore,p=c.prototype;
    p.show = function (score, type) {
        var _this = this;
        this.visible = true;
        this._text.text = score + "";
        var w = StageUtils.stageW;
        if (this._text.text.length * 15 + this.x > w) {
            this.x = w - this._text.text.length * 15;
        }
        else if (this.x - this._text.text.length * 15 < 0) {
            this.x = this._text.text.length * 15;
        }
        var color = 0xffffff;
        switch (type) {
            case 1:
                color = 0xFBC6C0;
                break;
            case 2:
                color = 0x52F5F4;
                break;
            case 3:
                color = 0xFEEE80;
                break;
            case 4:
                color = 0xCBF582;
                break;
        }
        this._text.textColor = color;
        var delay = 0;
        var tw1 = new Tween(this._text);
        tw1.from = {
            x: 0,
            y: 20,
            alpha: 1,
            scaleX: 0,
            scaleY: 0.5
        };
        tw1.to = {
            y: -70,
            scaleX: 1.1,
            scaleY: 1
        };
        tw1.duration = 200;
        tw1.start();
        delay += tw1.duration;
        var tw2 = new Tween(this._text);
        tw2.to = {
            y: -80,
            scaleX: 1
        };
        tw2.duration = 100;
        tw2.delay = delay;
        tw2.start();
        delay += tw2.duration;
        var tw3 = new Tween(this._text);
        tw3.to = {
            y: -160,
        };
        tw3.duration = 600;
        tw3.delay = delay;
        tw3.start();
        delay += tw3.duration;
        var tw4 = new Tween(this._text);
        tw4.to = {
            y: -170,
            scaleX: 1.3,
            scaleY: 1.2,
            alpha: 0.3
        };
        tw4.duration = 220;
        tw4.delay = delay;
        tw4.callBack = function () {
            ObjectPool.push(_this);
            _this.visible = false;
        };
        tw4.start();
    };
    return FloatScore;
}(egret.DisplayObjectContainer));
egret.registerClass(FloatScore,'FloatScore');
//# sourceMappingURL=FloatScore.js.map