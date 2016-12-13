/**
 *
 * 格子
 *
 */
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile() {
        _super.call(this);
        this.addChild(this._signIcon = DisplayUtils.createBitmap("gem_bg_2_png"));
        this.addChild(this._con = new egret.DisplayObjectContainer);
        this._con.addChild(this._icon = new egret.Bitmap);
        this._con.addChild(this._key = new egret.Bitmap);
        this.addChild(this._times = new Times);
        this.addTouch();
        AnchorUtils.setAnchor(this._signIcon, 0.5);
    }
    var d = __define,c=Tile,p=c.prototype;
    /**
     * 重置
     */
    p.reset = function () {
        this._con.scaleX = this._con.scaleY = 1;
        this._con.rotation = 0;
        this._con.alpha = 1;
        this.alpha = 1;
        this.rotation = 0;
        this._isSelect = false;
        this._isShake = false;
        this._touchObj.touchEnabled = true;
        this._signIcon.visible = false;
        this._key.visible = false;
        this._times.visible = false;
    };
    /**
     * 添加触摸
     */
    p.addTouch = function () {
        this.addChild(this._touchObj = new egret.Sprite);
        DrawUtils.drawCircle(this._touchObj, 35, 0);
        this._touchObj.alpha = 0;
        this._touchObj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this._touchObj.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
    };
    /**
     * 触摸回调
     */
    p.onTouch = function () {
        if (this._callBack) {
            this._callBack();
        }
    };
    /**
     * 设置图标
     */
    p.setIcon = function (iconName) {
        this._icon.texture = RES.getRes(iconName);
        AnchorUtils.setAnchor(this._icon, 0.5);
    };
    /**
     * 设置回调
     */
    p.setOnTouch = function (callBack) {
        this._callBack = callBack;
    };
    /**
     * 添加到
     */
    p.addTo = function (parent) {
        var _this = this;
        parent.addChild(this);
        var fx;
        switch (this._effect) {
            case TileEffect.BOMB:
                fx = ObjectPool.pop("ItemFireInFx");
                break;
            case TileEffect.CROSS:
                fx = ObjectPool.pop("ItemWaterInFx");
                break;
            case TileEffect.KIND:
                fx = ObjectPool.pop("ItemThunderInFx");
                break;
            case TileEffect.RANDOM:
                fx = ObjectPool.pop("ItemStormInFx");
                break;
        }
        if (fx != null) {
            this._icon.visible = false;
            this.addChild(fx);
            fx.setCallBack(function () {
                _this._icon.visible = true;
            });
            fx.play();
            this._itemInFx = fx;
        }
        else {
            this._icon.visible = true;
        }
    };
    d(p, "sign",undefined
        /**
         * 标记
         */
        ,function (value) {
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
    );
    /**
     * 选中
     */
    p.select = function (hl) {
        var _this = this;
        if (this._time) {
            if (hl) {
                this._timeFx.play();
            }
            else {
                this._timeFx.stopAtFirstFrame();
            }
            this._timeFx.visible = true;
            this._icon.visible = false;
        }
        else if (this._effect > 0) {
            if (hl) {
                this._itemFx.play();
            }
            else {
                this._itemFx.stopAtFirstFrame();
            }
            this._itemFx.visible = true;
            this._icon.visible = false;
        }
        else {
            if (!this._isSelect) {
                var duration = 500;
                var delay = 0;
                var tw = function (a, t, callBack) {
                    if (callBack === void 0) { callBack = null; }
                    var tw1 = new Tween(_this._con);
                    tw1.to = {
                        rotation: a
                    };
                    tw1.duration = t;
                    tw1.delay = delay;
                    tw1.callBack = callBack;
                    tw1.start();
                    delay += t;
                };
                this._con.rotation = 170;
                tw(10, duration * 0.5);
                tw(-10, delay * 0.25);
                tw(5, duration * 0.2);
                tw(0, duration * 0.05);
            }
            if (hl) {
                this.setIcon("gem_" + this._type + "_l_png");
            }
            else {
                this.setIcon("gem_" + this._type + "_s_png");
            }
        }
        this._isSelect = true;
    };
    /**
     * 取消选中
     */
    p.unselect = function () {
        if (this._time) {
            this._timeFx.visible = false;
            this._icon.visible = true;
        }
        else if (this._effect > 0) {
            this._itemFx.visible = false;
            this._icon.visible = true;
        }
        else {
            this.setIcon("gem_" + this._type + "_png");
        }
        this._isSelect = false;
    };
    /**
     * 消除
     */
    p.remove = function (duration) {
        this.unEnable();
        if (this._itemInFx) {
            this._itemInFx.destroy();
            this._icon.visible = true;
        }
        this.pos = new Vector2(-100, -100);
        var self = this;
        this.sign = false;
        var tween = new Tween(this._con);
        tween.to = { scaleX: 0.2, scaleY: 0.2 };
        tween.duration = duration;
        tween.callBack = function () {
            self.destroy();
        };
        tween.start();
        this._times.visible = false;
        this._key.visible = false;
    };
    /**
     * 击飞
     */
    p.hit = function (direction, duration) {
        var _this = this;
        this.unEnable();
        if (direction == Direction.Center) {
            this.destroy();
        }
        var m;
        var v;
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
        tween.updateFunc = function (t) {
            t /= 1000;
            var ax = vx * t;
            var ay = -vy * t + 1200 * t * t / 2;
            _this.x = x + ax;
            _this.y = y + ay;
            _this.alpha = 1 - Math.max((t - 0.5), 0) * 1.4;
            _this.rotation = Math.atan(ay / ax) / Math.PI * 180;
        };
        tween.callBack = function () {
            _this.destroy();
        };
        tween.duration = 1200;
        tween.start();
        this._times.visible = false;
        this._key.visible = false;
    };
    /**
     * 震动
     */
    p.shake = function (x, y) {
        var _this = this;
        if (this._isShake)
            return;
        this._isShake = true;
        var d = MathUtils.getDistance(this.x, this.y, x, y);
        var r = MathUtils.getRadian2(x, y, this.x, this.y);
        var l = 400 / Math.sqrt(d);
        var duration = 650;
        var delay = 0;
        var tw = function (a, t, callBack) {
            if (callBack === void 0) { callBack = null; }
            var tw1 = new Tween(_this._con);
            tw1.to = {
                x: l * Math.cos(r) * a,
                y: l * Math.sin(r) * a
            };
            tw1.duration = t;
            tw1.delay = delay;
            tw1.callBack = callBack;
            tw1.start();
            delay += t;
        };
        tw(1, 60);
        tw(0, duration / 7);
        tw(-0.7, duration / 7);
        tw(0, duration / 7);
        tw(0.4, duration / 7);
        tw(0, duration / 7);
        tw(-0.1, duration / 7);
        tw(0, duration / 7, function () {
            _this._isShake = false;
        });
    };
    /**
     * 无效
     */
    p.unEnable = function () {
        this._signIcon.visible = false;
        this.pos = new Vector2(0, 100);
        this._touchObj.touchEnabled = false;
    };
    /**
     * 移动
     */
    p.moveTo = function (targetPos, duration, callBack) {
        var _this = this;
        if (callBack === void 0) { callBack = null; }
        var tw = new Tween(this);
        var y = this.y;
        var speed = 0;
        var time = 0;
        var g = 6000;
        var flag = false;
        tw.to = { y: targetPos.y };
        tw.updateFunc = function (t) {
            if (flag) {
                _this.y = targetPos.y;
                return;
            }
            t /= 1000;
            t -= time;
            _this.y = speed * t + y + 1 / 2 * g * t * t;
            if (_this.y >= targetPos.y) {
                _this.y = targetPos.y;
                var speed1 = -g * t * 0.32;
                if (speed1 < -450) {
                    speed = speed1;
                    time += t;
                    y = targetPos.y;
                }
                else {
                    flag = true;
                }
            }
        };
        tw.duration = duration;
        tw.callBack = function () {
            callBack();
            if (_this._showKey) {
                var fx = ObjectPool.pop("KeyInFx");
                _this.addChild(fx);
                fx.play();
                _this._showKey = false;
            }
        };
        tw.start();
    };
    d(p, "type",undefined
        /**
         * 设置类型
         */
        ,function (value) {
            this._type = value;
            if (this._type == 0)
                return;
            this.setIcon("gem_" + value + "_png");
        }
    );
    d(p, "effect",undefined
        /**
         * 设置效果
         */
        ,function (value) {
            this._effect = value;
            if (this._effect) {
                this.setIcon("item_" + value + "_png");
                switch (this._effect) {
                    case TileEffect.BOMB:
                        this._itemFx = ObjectPool.pop("ItemFireSelectFx");
                        break;
                    case TileEffect.CROSS:
                        this._itemFx = ObjectPool.pop("ItemWaterSelectFx");
                        break;
                    case TileEffect.KIND:
                        this._itemFx = ObjectPool.pop("ItemThunderSelectFx");
                        break;
                    case TileEffect.RANDOM:
                        this._itemFx = ObjectPool.pop("ItemStormSelectFx");
                        break;
                }
                this.addChild(this._itemFx);
                this._itemFx.visible = false;
            }
        }
    );
    d(p, "key",undefined
        /**
         * 设置钥匙
         */
        ,function (value) {
            this._showKey = value;
            if (value) {
                this._key.visible = true;
                this._key.texture = RES.getRes("key_" + this._type + "_png");
                AnchorUtils.setAnchor(this._key, 0.5);
            }
            else {
                this._key.visible = false;
            }
        }
    );
    d(p, "time",undefined
        /**
         * 设置时间
         */
        ,function (value) {
            this._time = value;
            if (this._time) {
                this.setIcon("time_" + this._type + "_png");
                switch (this._type) {
                    case 1:
                        this._timeFx = ObjectPool.pop("TimeRedSelectFx");
                        break;
                    case 2:
                        this._timeFx = ObjectPool.pop("TimeBlueSelectFx");
                        break;
                    case 3:
                        this._timeFx = ObjectPool.pop("TimeYellowSelectFx");
                        break;
                    case 4:
                        this._timeFx = ObjectPool.pop("TimeGreenSelectFx");
                        break;
                }
                this.addChild(this._timeFx);
                this._timeFx.visible = false;
            }
        }
    );
    d(p, "times",undefined
        /**
         * 设置倍数
         */
        ,function (value) {
            if (value) {
                this._times.visible = true;
                this._times.setTimes(value);
            }
            else {
                this._times.visible = false;
            }
        }
    );
    d(p, "pos"
        /**
         * 获取位置
         */
        ,function () {
            return this._pos;
        }
        /**
         * 设置位置
         */
        ,function (value) {
            this._pos = value;
        }
    );
    /**
     * 销毁
     */
    p.destroy = function () {
        if (this._itemInFx) {
            this._itemInFx.destroy();
            this._itemInFx = null;
        }
        if (this._timeFx) {
            this._timeFx.destroy();
            this._timeFx = null;
        }
        if (this._itemFx) {
            this._itemFx.destroy();
            this._itemFx = null;
        }
        TweenManager.removeTween(this);
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return Tile;
}(egret.DisplayObjectContainer));
egret.registerClass(Tile,'Tile');
//# sourceMappingURL=Tile.js.map