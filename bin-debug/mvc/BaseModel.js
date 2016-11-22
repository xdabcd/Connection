/**
 *
 * Model基类
 *
 */
var BaseModel = (function () {
    /**
     * 构造函数
     * @param $controller 所属模块
     */
    function BaseModel($controller) {
        this._controller = $controller;
        this._controller.setModel(this);
    }
    var d = __define,c=BaseModel,p=c.prototype;
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
    return BaseModel;
}());
egret.registerClass(BaseModel,'BaseModel');
//# sourceMappingURL=BaseModel.js.map