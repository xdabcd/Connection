/**
 *
 * 加载界面
 *
 */
var LoadingScene = (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        _super.call(this);
        this._controller = new LoadingController(this);
    }
    var d = __define,c=LoadingScene,p=c.prototype;
    p.setProgress = function (cur, total) {
        // console.log(cur + "/" + total);
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
        this.visible = true;
    };
    /**
     * 关闭
     */
    p.close = function () {
        this.visible = false;
    };
    return LoadingScene;
}(BaseScene));
egret.registerClass(LoadingScene,'LoadingScene');
//# sourceMappingURL=LoadingScene.js.map