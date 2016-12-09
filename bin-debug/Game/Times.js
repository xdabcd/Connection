/**
 *
 * 倍数
 *
 */
var Times = (function (_super) {
    __extends(Times, _super);
    function Times() {
        _super.call(this);
        this.addChild(this._bg = DisplayUtils.createBitmap("times_png"));
        AnchorUtils.setAnchor(this._bg, 0.5);
        this.addChild(this._label = new Label);
        this._label.width = 120;
        this._label.size = 24;
        this._label.stroke = 3;
        this._label.textColor = 0;
        this._label.strokeColor = 0xFFFFFF;
        AnchorUtils.setAnchor(this._label, 0.5);
        this._label.y = 5;
    }
    var d = __define,c=Times,p=c.prototype;
    p.setTimes = function (value) {
        this._label.text = "x" + value;
    };
    /**
     * 销毁
     */
    p.destroy = function () {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return Times;
}(egret.DisplayObjectContainer));
egret.registerClass(Times,'Times');
//# sourceMappingURL=Times.js.map