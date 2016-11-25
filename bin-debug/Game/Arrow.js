/**
 *
 * 箭头
 *
 */
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow() {
        _super.call(this);
        this.addChild(DisplayUtils.createBitmap("arrow_png"));
        this.scaleX = this.scaleY = 0.7;
        AnchorUtils.setAnchor(this, 0.5);
    }
    var d = __define,c=Arrow,p=c.prototype;
    /**
     * 销毁
     */
    p.destroy = function () {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return Arrow;
}(egret.DisplayObjectContainer));
egret.registerClass(Arrow,'Arrow');
//# sourceMappingURL=Arrow.js.map