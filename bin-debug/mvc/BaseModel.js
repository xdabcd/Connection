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
        this._handles = [];
        this._time = 0;
        TimerManager.doFrame(1, 0, this.update, this);
    }
    var d = __define,c=BaseModel,p=c.prototype;
    /**
     * 更新
     */
    p.update = function (delta) {
        this._time += delta;
        var delArr = [];
        for (var i = 0; i < this._handles.length; i++) {
            if (this._time > this._handles[i].execTime) {
                this._handles[i].func();
                delArr.push(this._handles[i]);
            }
        }
        for (var i = 0; i < delArr.length; i++) {
            ArrayUtils.remove(this._handles, delArr[i]);
        }
    };
    /**
     * 延时执行
     */
    p.setTimeout = function (delay, func) {
        this._handles.push({
            execTime: delay + this._time,
            func: func
        });
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
    return BaseModel;
}());
egret.registerClass(BaseModel,'BaseModel');
//# sourceMappingURL=BaseModel.js.map