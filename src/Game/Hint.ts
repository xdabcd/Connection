/**
 *
 * 提示
 *
 */
class Hint extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(this._sprite = new egret.Bitmap);
    }

    private _sprite: egret.Bitmap;

    public show1(spriteName: string, anchorX: number = 0.5, anchorY: number = 0.5) {
        this._sprite.texture = RES.getRes(spriteName);
        AnchorUtils.setAnchorX(this._sprite, anchorX);
        AnchorUtils.setAnchorY(this._sprite, anchorY);

        this._sprite.y = 0;
        this._sprite.scaleX = this._sprite.scaleY = 3.5;
        this._sprite.alpha = 0.35;

        var tw1 = new Tween(this._sprite);
        tw1.to = { scaleX: 1.15, scaleY: 1.15, alpha: 1 };
        tw1.duration = 200;
        tw1.ease = TweenEase.QuadIn;
        tw1.start();
        var tw2 = new Tween(this._sprite);
        tw2.to = { scaleX: 1.1, scaleY: 1.1 };
        tw2.duration = 400;
        tw2.delay = tw1.delay + tw1.duration;
        tw2.start();
        var tw3 = new Tween(this._sprite);
        tw3.to = { scaleX: 1, scaleY: 1, alpha: 0.85 };
        tw3.duration = 20;
        tw3.delay = tw2.delay + tw2.duration;
        tw3.start();
        var tw4 = new Tween(this._sprite);
        tw4.to = { scaleX: 0.4, scaleY: 0.4, alpha: 0.35 };
        tw4.duration = 150;
        tw4.delay = tw3.delay + tw3.duration;
        tw4.callBack = () => this.destroy();
        tw4.start();
    }

    public show2(spriteName: string, anchorX: number = 0.5, anchorY: number = 0.5) {
        this._sprite.texture = RES.getRes(spriteName);
        AnchorUtils.setAnchorX(this._sprite, anchorX);
        AnchorUtils.setAnchorY(this._sprite, anchorY);

        this._sprite.y = -180;
        this._sprite.alpha = 0.35;
        this._sprite.scaleX = this._sprite.scaleY = 1;

        var tw1 = new Tween(this._sprite);
        tw1.to = { y: this._sprite.y + 180, alpha: 1 };
        tw1.duration = 200;
        tw1.start();

        var tw2 = new Tween(this._sprite);
        tw2.to = { scaleX: 0.35, scaleY: 0.35, alpha: 0 };
        tw2.duration = 500;
        tw2.delay = 600;
        tw2.ease = TweenEase.BackIn;
        tw2.callBack = () => this.destroy();
        tw2.start();
    }

    public show3(spriteName: string, anchorX: number = 0.5, anchorY: number = 0.5) {
        this._sprite.texture = RES.getRes(spriteName);
        AnchorUtils.setAnchorX(this._sprite, anchorX);
        AnchorUtils.setAnchorY(this._sprite, anchorY);

        this._sprite.alpha = 0;
        this._sprite.y = 0;
        this._sprite.scaleX = this._sprite.scaleY = 0.35;

        var tw1 = new Tween(this._sprite);
        tw1.to = { scaleX: 1, scaleY: 1, alpha: 1 };
        tw1.updateFunc = () => {
            if (this._sprite.alpha > 1) {
                this._sprite.alpha = 1;
            }
        }
        tw1.duration = 500;
        tw1.ease = TweenEase.BackOut;
        tw1.start();

        var tw2 = new Tween(this._sprite);
        tw2.to = { y: this._sprite.y + 180, alpha: 0.35 };
        tw2.delay = 900;
        tw2.duration = 200;
        tw2.callBack = () => this.destroy();
        tw2.start();
    }

    /**
     * 销毁
     */
    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}