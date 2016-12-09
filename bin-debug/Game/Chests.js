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
        this.addChild(this._key = new egret.Bitmap);
        this._key.visible = false;
    }
    var d = __define,c=Chests,p=c.prototype;
    p.initChests = function () {
        var l = this.width / 6;
        this._chestArr = [];
        for (var i = 0; i < 5; i++) {
            var door = ObjectPool.pop("DoorFx");
            door.x = l * (i + 1);
            door.y = 35;
            this.addChild(door);
            this._chestArr.push(door);
            door.playStatic();
        }
        this._unlockCnt = 0;
    };
    p.unlock = function (x, y, type) {
        var _this = this;
        var chest = this._chestArr[this._unlockCnt];
        if (chest) {
            this.setKey(x, y, type);
            var tw1 = new Tween(this._key);
            tw1.to = { y: chest.y + 10 };
            tw1.duration = 600;
            tw1.start();
            var tw2 = new Tween(this._key);
            tw2.to = { x: chest.x };
            tw2.duration = 600;
            tw2.ease = TweenEase.QuadOut;
            tw2.start();
            var tw3 = new Tween(this._key);
            tw3.to = { rotation: -440 };
            tw3.duration = 600;
            tw3.ease = TweenEase.QuadOut;
            tw3.start();
            var t4 = new Tween(this._key);
            t4.to = { alpha: 0 };
            t4.duration = 100;
            t4.delay = tw3.duration;
            t4.callBack = function () {
                _this._key.visible = false;
                _this._unlockCnt += 1;
                chest.playOpen();
            };
            t4.start();
        }
    };
    p.shake = function () {
        var tw1 = new Tween(this);
        tw1.to = { scaleX: 1.02, scaleY: 1.02 };
        tw1.duration = 80;
        tw1.start();
        var tw2 = new Tween(this);
        tw2.to = { scaleX: 1, scaleY: 1 };
        tw2.duration = 80;
        tw2.delay = tw1.duration + 30;
        tw2.start();
        for (var i = 0; i < this._chestArr.length; i++) {
            var door = this._chestArr[i];
            if (i < this._unlockCnt) {
                door.playShakeOpened();
            }
            else {
                door.playShakeClosed();
            }
        }
    };
    p.setKey = function (x, y, type) {
        this._key.texture = RES.getRes("key_" + type + "_png");
        this._key.visible = true;
        this._key.alpha = 1;
        this._key.x = x;
        this._key.y = y;
        AnchorUtils.setAnchor(this._key, 0.5);
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