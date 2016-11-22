/**
 *
 * 场景管理器
 *
 */
var SceneManager = (function () {
    /**
     * 构造函数
     */
    function SceneManager() {
        this._opens = [];
        this._scenes = {};
    }
    var d = __define,c=SceneManager,p=c.prototype;
    /**
     * 打开界面
     */
    p.open = function (id) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var scene = this._scenes[id];
        if (!scene) {
            switch (id) {
                case SceneID.Loading:
                    scene = ObjectPool.pop("LoadingScene");
                    break;
                case SceneID.Menu:
                    scene = ObjectPool.pop("MenuScene");
                    break;
                case SceneID.Game:
                    scene = ObjectPool.pop("GameScene");
                    break;
                default:
                    Log.trace("Scene_" + id + "不存在");
                    return;
            }
            this._scenes[id] = scene;
            StageUtils.stage.addChild(scene);
        }
        scene.open(param);
        if (this._opens.indexOf(id) < 0) {
            this._opens.push(id);
        }
        return scene;
    };
    /**
     * 关闭界面
     */
    p.close = function (id) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (this._opens.indexOf(id) < 0) {
            return;
        }
        var scene = this._scenes[id];
        if (!scene) {
            return;
        }
        ArrayUtils.remove(this._opens, id);
        scene.close(param);
    };
    /**
     * 获取界面
     */
    p.getScene = function (id) {
        return this._scenes[id];
    };
    /**
     * 关闭所有开启中的界面
     */
    p.closeAll = function () {
        while (this._opens.length) {
            this.close(this._opens[0]);
        }
    };
    d(SceneManager, "instance"
        ,function () {
            return this._instance || (this._instance = new SceneManager);
        }
    );
    return SceneManager;
}());
egret.registerClass(SceneManager,'SceneManager');
/**
 * 界面
 */
var SceneID;
(function (SceneID) {
    SceneID[SceneID["Loading"] = 0] = "Loading";
    SceneID[SceneID["Menu"] = 1] = "Menu";
    SceneID[SceneID["Game"] = 2] = "Game";
})(SceneID || (SceneID = {}));
//# sourceMappingURL=SceneManager.js.map