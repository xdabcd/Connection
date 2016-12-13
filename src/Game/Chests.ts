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

        this.addChild(this._key = new egret.Bitmap);
        this._key.visible = false;
    }

    private _bg: egret.Bitmap;
    private _chestArr: Array<DoorFx>;
    private _hint: egret.Bitmap;
    private _key: egret.Bitmap;
    private _unlockCnt: number;

    private initChests() {
        var l = this.width / 6;
        this._chestArr = [];
        for (let i = 0; i < 5; i++) {
            var door = ObjectPool.pop("DoorFx") as DoorFx;
            door.x = l * (i + 1);
            door.y = 35;
            this.addChild(door);
            this._chestArr.push(door);
            door.playStatic();
        }
        this._unlockCnt = 0;
    }

    public unlock(x: number, y: number, type: number) {
        var chest = this._chestArr[this._unlockCnt];
        if (chest) {
            this.setKey(x, y, type);
            var tw1 = new Tween(this._key);
            tw1.to = { y: chest.y + 10 };
            tw1.duration = 500;
            tw1.start();
            var tw2 = new Tween(this._key);
            tw2.to = { x: chest.x };
            tw2.duration = 500;
            tw2.ease = TweenEase.QuadOut;
            tw2.start();
            var tw3 = new Tween(this._key);
            tw3.to = { rotation: -200, scaleX: 1.1, scaleY: 1.1 };
            tw3.duration = 500;
            tw3.ease = TweenEase.QuadOut;
            tw3.start();
            var t4 = new Tween(this._key);
            t4.to = { alpha: 0 };
            t4.duration = 100;
            t4.delay = tw3.duration;
            t4.callBack = () => {
                this._key.visible = false;
                this._unlockCnt += 1;
                chest.playOpen();
            };
            t4.start();
        }
    }

    public shake() {
        var tw1 = new Tween(this);
        tw1.to = { scaleX: 1.02, scaleY: 1.02 };
        tw1.duration = 80;
        tw1.start();
        var tw2 = new Tween(this);
        tw2.to = { scaleX: 1, scaleY: 1 };
        tw2.duration = 80;
        tw2.delay = tw1.duration + 30;
        tw2.start();
        for (let i = 0; i < this._chestArr.length; i++) {
            var door = this._chestArr[i];
            if (i < this._unlockCnt) {
                door.playShakeOpened();
            } else {
                door.playShakeClosed();
            }
        }
    }

    private setKey(x: number, y: number, type: number) {
        this._key.texture = RES.getRes("key_" + 5 + "_png");
        this._key.visible = true;
        this._key.alpha = 1;
        this._key.scaleX = this._key.scaleY = 1;
        this._key.x = x;
        this._key.y = y;
        AnchorUtils.setAnchor(this._key, 0.5);
    }

    /**
     * 销毁
     */
    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}