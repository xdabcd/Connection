/**
 *
 * 格子
 *
 */
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile() {
        _super.call(this);
        this.addChild(this._sprite = new egret.Sprite);
        this.addChild(this._selectEffect = new egret.Sprite);
        this.addChild(this._effectSprte = new egret.Sprite);
        this.width = this.height = this.size;
        this.addTouch();
    }
    var d = __define,c=Tile,p=c.prototype;
    /**
     * 重置
     */
    p.reset = function () {
        this._sprite.scaleX = this._sprite.scaleY = 1;
        this._sprite.alpha = 1;
        this._effectSprte.scaleX = this._effectSprte.scaleY = 1;
        this._effectSprte.alpha = 1;
        this._selectEffect.visible = false;
    };
    /**
     * 添加触摸区域
     */
    p.addTouch = function () {
        var size = this.size;
        var s = size * 6 / 7;
        var touch = new egret.Sprite;
        DrawUtils.drawRect(touch, s, s, 0xffffff);
        touch.alpha = 0;
        touch.x = size / 2;
        touch.y = size / 2;
        AnchorUtils.setAnchor(touch, 0.5);
        this.addChild(touch);
        touch.touchEnabled = true;
        touch.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        touch.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
        this._touch = touch;
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
    /**
     * 选中
     */
    p.select = function () {
        var se = this._selectEffect;
        egret.Tween.removeTweens(se);
        se.visible = true;
        se.scaleX = se.scaleY = 1;
        se.alpha = 0.6;
        egret.Tween.get(se).to({ scaleX: 2.5, scaleY: 2.5, alpha: 0.1 }, 400, egret.Ease.sineIn)
            .call(function () {
            se.visible = false;
        });
        var s = this._sprite;
        egret.Tween.get(s).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0.5 }, 200);
    };
    /**
     * 取消选中
     */
    p.unselect = function () {
        var s = this._sprite;
        egret.Tween.get(s).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
    };
    /**
     * 消除
     */
    p.remove = function (duration) {
        var self = this;
        egret.Tween.get(this._sprite).to({ scaleX: 0.2, scaleY: 0.2 }, duration)
            .call(function () {
            DisplayUtils.removeFromParent(self);
            ObjectPool.push(self);
        });
        ;
        switch (this._effect) {
        }
    };
    /**
     * 移动
     */
    p.moveTo = function (targetPos, duration, callBack) {
        if (callBack === void 0) { callBack = null; }
        egret.Tween.get(this).to({ x: targetPos.x, y: targetPos.y }, duration, egret.Ease.elasticOut)
            .call(function () {
            if (callBack) {
                callBack();
            }
        });
    };
    d(p, "type",undefined
        /**
         * 设置类型
         */
        ,function (value) {
            this._type = value;
            var sprite = this._sprite;
            var size = this.size;
            var s = size * 3 / 7;
            DrawUtils.drawRoundRect(sprite, s, s, s / 3, s / 3, this.color);
            var se = this._selectEffect;
            DrawUtils.drawRoundRect(se, s, s, s / 3, s / 3, this.color);
            se.x = size / 2;
            se.y = size / 2;
            se.visible = false;
            AnchorUtils.setAnchor(se, 0.5);
            sprite.x = size / 2;
            sprite.y = size / 2;
            AnchorUtils.setAnchor(sprite, 0.5);
        }
    );
    d(p, "effect",undefined
        /**
         * 设置效果
         */
        ,function (value) {
            this._effect = value;
            var e = this._effectSprte;
            var s = this.size;
            switch (this._effect) {
                case TileEffect.NONE:
                    e.graphics.clear();
                    break;
            }
            e.x = s / 2;
            e.y = s / 2;
            AnchorUtils.setAnchor(e, 0.5);
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
    d(p, "size"
        /**
         * 大小
         */
        ,function () {
            return GameData.tileSize;
        }
    );
    d(p, "color"
        /**
         * 颜色
         */
        ,function () {
            return GameData.getTileColor(this._type);
        }
    );
    return Tile;
}(egret.DisplayObjectContainer));
egret.registerClass(Tile,'Tile');
//# sourceMappingURL=Tile.js.map