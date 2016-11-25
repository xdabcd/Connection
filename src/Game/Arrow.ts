/**
 *
 * 箭头
 *
 */
class Arrow extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(DisplayUtils.createBitmap("arrow_png"));
        this.scaleX = this.scaleY = 0.7;
        AnchorUtils.setAnchor(this, 0.5);
    }

    /**
     * 销毁
     */
    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}