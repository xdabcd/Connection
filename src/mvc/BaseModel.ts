/**
 * 
 * Model基类
 * 
 */
class BaseModel {
    private _controller: BaseController;
    private _time: number;
    private _handles: Array<any>;

    /**
     * 构造函数
     * @param $controller 所属模块
     */
    public constructor($controller: BaseController) {
        this._controller = $controller;
        this._controller.setModel(this);
        this._handles = [];
        this._time = 0;
        TimerManager.doFrame(1, 0, this.update, this);
    }

    /**
     * 更新
     */
    protected update(delta: number) {
        this._time += delta;
        var delArr = [];
        for (let i = 0; i < this._handles.length; i++) {
            if (this._time > (this._handles[i].execTime as number)) {
                this._handles[i].func();
                delArr.push(this._handles[i]);
            }
        }
        for (let i = 0; i < delArr.length; i++) {
            ArrayUtils.remove(this._handles, delArr[i]);
        }
    }

    /**
     * 延时执行
     */
    protected setTimeout(delay: number, func: Function) {
        this._handles.push({
            execTime: delay + this._time,
            func: func
        });
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    protected applyFunc(key: any, ...param: any[]): any {
        return this._controller.applyFunc.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    protected applyControllerFunc(controllerKey: number, key: any, ...param: any[]): any {
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    }
}
