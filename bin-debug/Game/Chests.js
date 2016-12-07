/**
 *
 * 宝箱
 *
 */
var Chests = (function (_super) {
    __extends(Chests, _super);
    function Chests() {
        _super.call(this);
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
    var d = __define,c=Chests,p=c.prototype;
    p.initChests = function () {
        var l = this.width / 6;
        this._chestArr = [];
        for (var i = 0; i < 5; i++) {
            var chest = DisplayUtils.createBitmap("chest_png");
            AnchorUtils.setAnchorX(chest, 0.5);
            chest.x = l * (i + 1);
            chest.y = -7;
            this.addChild(chest);
            this._chestArr.push(chest);
        }
    };
    /**
     * 销毁
     */
    p.destroy = function () {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return Chests;
}(egret.DisplayObjectContainer));
egret.registerClass(Chests,'Chests');
//# sourceMappingURL=Chests.js.map