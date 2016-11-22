/**
 *
 * Scene基类
 *
 */
var BaseScene = (function (_super) {
    __extends(BaseScene, _super);
    /**
     * 构造函数（初始化controller）
     */
    function BaseScene() {
        _super.call(this);
        this._isInit = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        StageUtils.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
    }
    var d = __define,c=BaseScene,p=c.prototype;
    p.onAddToStage = function (event) {
        if (!this._isInit) {
            this.init();
            this._isInit = true;
        }
    };
    /**
     * 初始化
     */
    p.init = function () {
    };
    /**
     * 屏幕尺寸变化时调用
     */
    p.onResize = function () {
    };
    /**
     * 打开
     */
    p.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
    };
    /**
     * 关闭
     */
    p.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
    };
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    p.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return this._controller.applyFunc.apply(this._controller, arguments);
    };
    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    p.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    };
    /**
     * 设置是否隐藏
     * @param value
     */
    p.setVisible = function (value) {
        this.visible = value;
    };
    return BaseScene;
}(egret.DisplayObjectContainer));
egret.registerClass(BaseScene,'BaseScene');
//# sourceMappingURL=BaseScene.js.map