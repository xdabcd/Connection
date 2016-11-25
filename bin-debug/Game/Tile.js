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
        this.addChild(this._icon = new egret.Bitmap);
        this.addTouch();
        AnchorUtils.setAnchor(this._icon, 0.5);
        AnchorUtils.setAnchor(this._signIcon, 0.5);
    }
    var d = __define,c=Tile,p=c.prototype;
    /**
     * 重置
     */
    p.reset = function () {
        this._icon.scaleX = this._icon.scaleY = 1;
        this._icon.rotation = 0;
        this._icon.alpha = 1;
        this._signIcon.visible = false;
        this._isSelect = false;
    };
    /**
     * 添加触摸
     */
    p.addTouch = function () {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
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
     * 设置回调
     */
    p.setOnTouch = function (callBack) {
        this._callBack = callBack;
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
        if (!this._isSelect) {
            var tween = new Tween(this._icon);
            tween.from = { rotation: 170 };
            tween.to = { rotation: 0 };
            tween.ease = TweenEase.QuartOut;
            tween.duration = 400;
            tween.start();
        }
        this._isSelect = true;
        if (this._type == 0)
            return;
        if (hl) {
            this._icon.texture = RES.getRes("gem_" + this._type + "_l_png");
        }
        else {
            this._icon.texture = RES.getRes("gem_" + this._type + "_s_png");
        }
    };
    /**
     * 取消选中
     */
    p.unselect = function () {
        this._isSelect = false;
        if (this._type == 0)
            return;
        this._icon.texture = RES.getRes("gem_" + this._type + "_png");
    };
    /**
     * 消除
     */
    p.remove = function (duration) {
        var self = this;
        this.sign = false;
        var tween = new Tween(this._icon);
        tween.to = { scaleX: 0.2, scaleY: 0.2 };
        tween.duration = duration;
        tween.callBack = function () {
            DisplayUtils.removeFromParent(self);
            ObjectPool.push(self);
        };
        tween.start();
        switch (this._effect) {
        }
    };
    /**
     * 击飞
     */
    p.hit = function () {
        var _this = this;
        var v = 20;
        var a = 30;
        var vx = v * Math.sin(a);
        var vy = v * Math.cos(a);
        var tween = new Tween(this);
        var x = this.x;
        var y = this.y;
        tween.updateFunc = function (t) {
            t /= 100;
            _this.x = x + vx * t;
            _this.y = y - vy * t + 10 * t * t / 2;
            console.log(x);
            console.log(vx * t);
        };
        tween.duration = 2000;
        tween.start();
    };
    /**
     * 移动
     */
    p.moveTo = function (targetPos, duration, callBack) {
        if (callBack === void 0) { callBack = null; }
        var tween = new Tween(this);
        tween.to = { x: targetPos.x, y: targetPos.y };
        tween.duration = duration;
        tween.ease = TweenEase.BounceOut;
        tween.callBack = callBack;
        tween.start();
    };
    d(p, "type",undefined
        /**
         * 设置类型
         */
        ,function (value) {
            this._type = value;
            if (this._type == 0)
                return;
            this._icon.texture = RES.getRes("gem_" + value + "_png");
        }
    );
    d(p, "effect",undefined
        /**
         * 设置效果
         */
        ,function (value) {
            this._effect = value;
            if (this._effect == TileEffect.NONE)
                return;
            this._icon.texture = RES.getRes("item_" + value + "_png");
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
    return Tile;
}(egret.DisplayObjectContainer));
egret.registerClass(Tile,'Tile');
//# sourceMappingURL=Tile.js.map