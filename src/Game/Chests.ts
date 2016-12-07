/**
 *
 * 宝箱
 *
 */
class Chests extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(this._bg = DisplayUtils.createBitmap("chest_bg_png"));
        this.width = this._bg.width;
        this.height = this._bg.height;
        this.addChild(this._hint = DisplayUtils.createBitmap("hint_png"));
        AnchorUtils.setAnchorX(this._hint, 0.5);
        AnchorUtils.setAnchorY(this._hint, 1);
        this._hint.x = this.width / 2;
        this._hint.y = this.height;

        this.initChests();
    }

    private _bg: egret.Bitmap;
    private _chestArr: Array<egret.Bitmap>;
    private _hint: egret.Bitmap;

    private initChests() {
        var l = this.width / 6;
        this._chestArr = [];
        for (let i = 0; i < 5; i++) {
            var chest = DisplayUtils.createBitmap("chest_png");
            AnchorUtils.setAnchorX(chest, 0.5);
            chest.x = l * (i + 1);
            chest.y = -7;
            this.addChild(chest);
            this._chestArr.push(chest);
        }
    }

    /**
     * 销毁
     */
    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}