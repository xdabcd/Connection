/**
 *
 * 文本
 *
 */
class Label extends egret.TextField {
    public constructor() {
        super();
        this.fontFamily = GameData.font;
        this.textAlign = "center";
    }

    public $setText(value: string): boolean {
        super.$setText(value);
        this.anchorOffsetX = this["anchorX"] * this.width;
        this.anchorOffsetY = this["anchorY"] * this.height;
        return true;
    }
}
