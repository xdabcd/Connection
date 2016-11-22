/**
 *
 * 加载控制器
 *
 */
var LoadingController = (function (_super) {
    __extends(LoadingController, _super);
    function LoadingController(scene) {
        _super.call(this, scene);
        ControllerManager.instance.register(ControllerID.Loading, this);
        this.registerFunc(LoadingCmd.SET_PROGRESS, this.setProgress, this);
    }
    var d = __define,c=LoadingController,p=c.prototype;
    /**
     * 设置加载进度
     */
    p.setProgress = function (cur, total) {
        this.scene.setProgress(cur, total);
    };
    d(p, "scene"
        /**
         * 界面
         */
        ,function () {
            return this._scene;
        }
    );
    return LoadingController;
}(BaseController));
egret.registerClass(LoadingController,'LoadingController');
//# sourceMappingURL=LoadingController.js.map