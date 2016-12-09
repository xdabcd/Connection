/**
 *
 * 倍数
 *
 */
class Times extends egret.DisplayObjectContainer {
    public constructor() {
        super();
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

    private _bg: egret.Bitmap;
    private _label: Label;

    public setTimes(value: number) {
        this._label.text = "x" + value;
    }

    /**
     * 销毁
     */
    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}