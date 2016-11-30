/**
 *
 * 格子
 *
 */
class Tile extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(this._signIcon = DisplayUtils.createBitmap("gem_bg_2_png"));
        this.addChild(this._icon = new egret.Bitmap);
        this.addTouch();
        AnchorUtils.setAnchor(this._icon, 0.5);
        AnchorUtils.setAnchor(this._signIcon, 0.5);
    }

    /** 触摸回调 */
    private _callBack: Function;
    /** 图标 */
    private _icon: egret.Bitmap;
    /** 标记 */
    private _signIcon: egret.Bitmap;
    /** 位置 */
    private _pos: Vector2;
    /** 类型 */
    private _type: number;
    /** 效果 */
    private _effect: TileEffect;
    /** 是否被选中 */
    private _isSelect: boolean;

    /**
     * 重置
     */
    public reset() {
        this._icon.scaleX = this._icon.scaleY = 1;
        this._icon.rotation = 0;
        this._icon.alpha = 1;
        this.alpha = 1;
        this.rotation = 0;
        this._signIcon.visible = false;
        this._isSelect = false;
        this.touchEnabled = true;
    }

    /**
     * 添加触摸
     */
    private addTouch() {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
    }

    /**
     * 触摸回调
     */
    private onTouch() {
        if (this._callBack) {
            this._callBack();
        }
    }

    /**
     * 设置回调
     */
    public setOnTouch(callBack: Function) {
        this._callBack = callBack;
    }

    /**
     * 标记
     */
    public set sign(value: boolean) {
        var s = this._signIcon;
        if (value && !s.visible) {
            s.scaleX = s.scaleY = 0.8;
            var tween = new Tween(s);
            tween.to = { scaleX: 1, scaleY: 1 };
            tween.duration = 150;
            tween.start();
        }
        s.visible = value;
    }

    /**
     * 选中
     */
    public select(hl: boolean) {
        if (!this._isSelect) {
            var tween = new Tween(this._icon);
            tween.from = { rotation: 170 };
            tween.to = { rotation: 0 };
            tween.ease = TweenEase.QuartOut;
            tween.duration = 400;
            tween.start();
        }
        this._isSelect = true;
        if (this._type == 0) return;
        if (hl) {
            this._icon.texture = RES.getRes("gem_" + this._type + "_l_png");
        } else {
            this._icon.texture = RES.getRes("gem_" + this._type + "_s_png");
        }
    }

	/**
     * 取消选中
     */
    public unselect() {
        this._isSelect = false;
        if (this._type == 0) return;
        this._icon.texture = RES.getRes("gem_" + this._type + "_png");
    }

    /**
     * 消除
     */
    public remove(duration: number) {
        this.unEnable();
        this.pos = new Vector2(-100, -100);
        var self = this;
        this.sign = false;
        var tween = new Tween(this._icon);
        tween.to = { scaleX: 0.2, scaleY: 0.2 };
        tween.duration = duration;
        tween.callBack = () => {
            self.destroy();
        };
        tween.start();

        switch (this._effect) {

        }
    }

    /**
     * 击飞
     */
    public hit(direction: Direction, duration: number) {
        this.unEnable();
        if (direction == Direction.Center) {
            this.destroy();
        }
        var m: number;
        var v: number;
        switch (direction) {
            case Direction.Left:
                v = 300;
                m = -RandomUtils.limit(0.6, 1.1);
                break;
            case Direction.Right:
                v = 300;
                m = RandomUtils.limit(0.6, 1.1);
                break;
            case Direction.Up:
                v = 600;
                m = RandomUtils.limit(0.05, 0.15) * (Math.random() > 0.5 ? 1 : -1);
                break;
            case Direction.Down:
                v = 120;
                m = RandomUtils.limit(2.05, 2.15) * (Math.random() > 0.5 ? 1 : -1);
                break;
        }
        var a = Math.PI / 2 * m;
        var vx = v * Math.sin(a);
        var vy = v * Math.cos(a);
        var tween = new Tween(this);
        var x = this.x;
        var y = this.y;
        tween.updateFunc = (t) => {
            t /= 1000;
            let ax = vx * t;
            let ay = - vy * t + 1200 * t * t / 2;
            this.x = x + ax;
            this.y = y + ay;
            this.alpha = 1 - (t - 0.5);
            this.rotation = Math.atan(ay / ax) / Math.PI * 180;
        }
        tween.callBack = () => {
            this.destroy();
        };
        tween.duration = 1200;
        tween.start();
    }

    /**
     * 震动
     */
    public shake(x: number, y: number) {
        // var d = MathUtils.getDistance(this.x, this.y, x, y);
        // var r = MathUtils.getRadian2(x, y, this.x, this.y);
        // var l = 5000 / d;
        // console.log(l);
        // var tw = new Tween(this._icon);
        // tw.to = {
        //     x: l * Math.sin(r),
        //     y: l * Math.cos(r)
        // };
        // tw.duration = 500;
        // tw.start();
    }

    /**
     * 无效
     */
    private unEnable() {
        this._signIcon.visible = false;
        this.pos = new Vector2(0, 100);
        this.touchEnabled = false;
    }

	/**
	 * 移动
	 */
    public moveTo(targetPos: Vector2, duration: number, callBack: Function = null) {
        var tween = new Tween(this);
        tween.to = { x: targetPos.x, y: targetPos.y };
        tween.duration = duration;
        tween.ease = TweenEase.BounceOut;
        tween.callBack = callBack;
        tween.start();
    }

	/**
	 * 设置类型
	 */
    public set type(value: number) {
        this._type = value;
        if (this._type == 0) return;
        this._icon.texture = RES.getRes("gem_" + value + "_png");
    }

    /**
     * 设置效果
     */
    public set effect(value: TileEffect) {
        this._effect = value;
        if (this._effect == TileEffect.NONE) return;
        this._icon.texture = RES.getRes("item_" + value + "_png");
    }

	/**
	 * 获取位置
	 */
    public get pos(): Vector2 {
        return this._pos;
    }

    /**
	 * 设置位置
	 */
    public set pos(value: Vector2) {
        this._pos = value;
    }

    /**
     * 销毁
     */
    public destroy() {
        TweenManager.removeTween(this);
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}