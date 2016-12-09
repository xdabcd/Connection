/**
 *
 * 格子
 *
 */
class Tile extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(this._signIcon = DisplayUtils.createBitmap("gem_bg_2_png"));
        this.addChild(this._con = new egret.DisplayObjectContainer);
        this._con.addChild(this._icon = new egret.Bitmap);
        this._con.addChild(this._key = new egret.Bitmap);
        this.addChild(this._times = new Times);

        this.addTouch();
        AnchorUtils.setAnchor(this._signIcon, 0.5);
    }

    /** 触摸范围 */
    private _touchObj: egret.Sprite;
    /** 触摸回调 */
    private _callBack: Function;
    /** 容器 */
    private _con: egret.DisplayObjectContainer;
    /** 图标 */
    private _icon: egret.Bitmap;
    /** 钥匙 */
    private _key: egret.Bitmap;
    /** 倍数 */
    private _times: Times;
    /** 时间动画 */
    private _timeFx: Fx;
    /** 标记 */
    private _signIcon: egret.Bitmap;
    /** 位置 */
    private _pos: Vector2;
    /** 类型 */
    private _type: number;
    /** 效果 */
    private _effect: TileEffect;
    /** 时间 */
    private _time: boolean;
    /** 是否被选中 */
    private _isSelect: boolean;
    private _isShake: boolean;
    private _showKey: boolean;

    /**
     * 重置
     */
    public reset() {
        this._con.scaleX = this._con.scaleY = 1;
        this._con.rotation = 0;
        this._con.alpha = 1;
        this.alpha = 1;
        this.rotation = 0;
        this._signIcon.visible = false;
        this._isSelect = false;
        this._touchObj.touchEnabled = true;
        this._isShake = false;
    }

    /**
     * 添加触摸
     */
    private addTouch() {
        this.addChild(this._touchObj = new egret.Sprite);
        DrawUtils.drawCircle(this._touchObj, 35, 0);
        this._touchObj.alpha = 0;
        this._touchObj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this._touchObj.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
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
     * 设置图标
     */
    private setIcon(iconName: string) {
        this._icon.texture = RES.getRes(iconName);
        AnchorUtils.setAnchor(this._icon, 0.5);
    }

    /**
     * 设置回调
     */
    public setOnTouch(callBack: Function) {
        this._callBack = callBack;
    }

    /**
     * 添加到
     */
    public addTo(parent: egret.DisplayObjectContainer) {
        parent.addChild(this);
        var fx: Fx;
        switch (this._effect) {
            case TileEffect.BOMB:
                fx = ObjectPool.pop("ItemFireInFx") as ItemFireInFx;
                break;
            case TileEffect.CROSS:
                fx = ObjectPool.pop("ItemWaterInFx") as ItemWaterInFx;
                break;
            case TileEffect.KIND:
                fx = ObjectPool.pop("ItemThunderInFx") as ItemThunderInFx;
                break;
            case TileEffect.RANDOM:
                fx = ObjectPool.pop("ItemStormInFx") as ItemStormInFx;
                break;
        }
        if (fx != null) {
            this._icon.visible = false;
            this.addChild(fx);
            fx.setCallBack(() => {
                this._icon.visible = true;
            });
            fx.play();
        }
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
        if (this._time) {
            if (hl) {
                this._timeFx.play();
            } else {
                this._timeFx.stopAtFirstFrame();
            }
            this._timeFx.visible = true;
            this._icon.visible = false;
        } else if (this._effect > 0) {

        } else {
            if (!this._isSelect) {
                var duration = 500;
                var delay = 0;
                var tw = (a: number, t: number, callBack: Function = null) => {
                    var tw1 = new Tween(this._con);
                    tw1.to = {
                        rotation: a
                    };
                    tw1.duration = t;
                    tw1.delay = delay;
                    tw1.callBack = callBack;
                    tw1.start();
                    delay += t;
                }
                this._con.rotation = 170;
                tw(10, duration * 0.5);
                tw(-10, delay * 0.25);
                tw(5, duration * 0.2);
                tw(0, duration * 0.05);
            }
            if (hl) {
                this.setIcon("gem_" + this._type + "_l_png");
            } else {
                this.setIcon("gem_" + this._type + "_s_png");
            }
        }
        this._isSelect = true;
    }

	/**
     * 取消选中
     */
    public unselect() {
        if (this._time) {
            this._timeFx.visible = false;
            this._icon.visible = true;
        } else if (this._effect > 0) {

        } else {
            this.setIcon("gem_" + this._type + "_png");
        }
        this._isSelect = false;
    }

    /**
     * 消除
     */
    public remove(duration: number) {
        this.unEnable();
        this.pos = new Vector2(-100, -100);
        var self = this;
        this.sign = false;
        var tween = new Tween(this._con);
        tween.to = { scaleX: 0.2, scaleY: 0.2 };
        tween.duration = duration;
        tween.callBack = () => {
            self.destroy();
        };
        tween.start();

        this._times.visible = false;
        this._key.visible = false;
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
                v = 400;
                m = -RandomUtils.limit(0.4, 1.05);
                break;
            case Direction.Right:
                v = 400;
                m = RandomUtils.limit(0.4, 1.05);
                break;
            case Direction.Up:
                v = 600;
                m = RandomUtils.limit(0.05, 0.25) * (Math.random() > 0.5 ? 1 : -1);
                break;
            case Direction.Down:
                v = 120;
                m = RandomUtils.limit(2.05, 2.25) * (Math.random() > 0.5 ? 1 : -1);
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
            this.alpha = 1 - Math.max((t - 0.5), 0) * 1.4;
            this.rotation = Math.atan(ay / ax) / Math.PI * 180;
        }
        tween.callBack = () => {
            this.destroy();
        };
        tween.duration = 1200;
        tween.start();

        this._times.visible = false;
        this._key.visible = false;
    }

    /**
     * 震动
     */
    public shake(x: number, y: number) {
        if (this._isShake) return;
        this._isShake = true;
        var d = MathUtils.getDistance(this.x, this.y, x, y);
        var r = MathUtils.getRadian2(x, y, this.x, this.y);
        var l = 400 / Math.sqrt(d);
        var duration = 650;
        var delay = 0;
        var tw = (a: number, t: number, callBack: Function = null) => {
            var tw1 = new Tween(this._con);
            tw1.to = {
                x: l * Math.cos(r) * a,
                y: l * Math.sin(r) * a
            };
            tw1.duration = t;
            tw1.delay = delay;
            tw1.callBack = callBack;
            tw1.start();
            delay += t;
        }
        tw(1, 60);
        tw(0, duration / 7);
        tw(-0.7, duration / 7);
        tw(0, duration / 7);
        tw(0.4, duration / 7);
        tw(0, duration / 7);
        tw(-0.1, duration / 7);
        tw(0, duration / 7, () => {
            this._isShake = false;
        });
    }

    /**
     * 无效
     */
    private unEnable() {
        this._signIcon.visible = false;
        this.pos = new Vector2(0, 100);
        this._touchObj.touchEnabled = false;
    }

	/**
	 * 移动
	 */
    public moveTo(targetPos: Vector2, duration: number, callBack: Function = null) {
        var tw = new Tween(this);
        var y = this.y;
        var speed = 0;
        var time = 0;
        var g = 6000;
        var flag = false;
        tw.to = { y: targetPos.y };
        tw.updateFunc = (t) => {
            if (flag) {
                this.y = targetPos.y;
                return;
            }
            t /= 1000;
            t -= time;
            this.y = speed * t + y + 1 / 2 * g * t * t;

            if (this.y >= targetPos.y) {
                this.y = targetPos.y;
                var speed1 = -g * t * 0.32;
                if (speed1 < -450) {
                    speed = speed1;
                    time += t;
                    y = targetPos.y;
                } else {
                    flag = true;
                }
            }
        }
        tw.duration = duration;
        tw.callBack = () => {
            callBack();
            if (this._showKey) {
                var fx = ObjectPool.pop("KeyInFx") as KeyInFx;
                this.addChild(fx);
                fx.play();
                this._showKey = false;
            }
        };
        tw.start();
    }

	/**
	 * 设置类型
	 */
    public set type(value: number) {
        this._type = value;
        if (this._type == 0) return;
        this.setIcon("gem_" + value + "_png");
    }

    /**
     * 设置效果
     */
    public set effect(value: TileEffect) {
        this._effect = value;
        if (this._effect == TileEffect.NONE) return;
        this.setIcon("item_" + value + "_png");
    }

    /**
     * 设置钥匙
     */
    public set key(value: boolean) {
        this._showKey = value;
        if (value) {
            this._key.visible = true;
            this._key.texture = RES.getRes("key_" + this._type + "_png");
            AnchorUtils.setAnchor(this._key, 0.5);
        } else {
            this._key.visible = false;
        }
    }

    /**
     * 设置时间
     */
    public set time(value: boolean) {
        this._time = value;
        if (this._timeFx) {
            this._timeFx.destroy();
        }
        if (this._time) {
            this.setIcon("time_" + this._type + "_png");
            switch (this._type) {
                case 1:
                    this._timeFx = ObjectPool.pop("TimeRedSelectFx") as TimeRedSelectFx;
                    break;
                case 2:
                    this._timeFx = ObjectPool.pop("TimeBlueSelectFx") as TimeBlueSelectFx;
                    break;
                case 3:
                    this._timeFx = ObjectPool.pop("TimeYellowSelectFx") as TimeYellowSelectFx;
                    break;
                case 4:
                    this._timeFx = ObjectPool.pop("TimeGreenSelectFx") as TimeGreenSelectFx;
                    break;
            }
            this.addChild(this._timeFx);
            this._timeFx.visible = false;
        }
    }

    /**
     * 设置倍数
     */
    public set times(value: number) {
        if (value) {
            this._times.visible = true;
            this._times.setTimes(value);
        } else {
            this._times.visible = false;
        }
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