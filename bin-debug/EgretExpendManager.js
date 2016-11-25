/**
 *
 * 引擎扩展工具管理器
 *
 */
var EgretExpandManager = (function () {
    function EgretExpandManager() {
    }
    var d = __define,c=EgretExpandManager,p=c.prototype;
    /**
     * 初始化函数
     */
    EgretExpandManager.init = function () {
        AnchorUtils.init();
        TimerManager.init();
        TweenManager.init();
    };
    return EgretExpandManager;
}());
egret.registerClass(EgretExpandManager,'EgretExpandManager');
//# sourceMappingURL=EgretExpendManager.js.map