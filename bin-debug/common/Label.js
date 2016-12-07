/**
 *
 * 文本
 *
 */
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        _super.call(this);
        this.fontFamily = GameData.font;
        this.textAlign = "center";
    }
    var d = __define,c=Label,p=c.prototype;
    p.$setText = function (value) {
        _super.prototype.$setText.call(this, value);
        this.anchorOffsetX = this["anchorX"] * this.width;
        this.anchorOffsetY = this["anchorY"] * this.height;
        return true;
    };
    return Label;
}(egret.TextField));
egret.registerClass(Label,'Label');
//# sourceMappingURL=Label.js.map