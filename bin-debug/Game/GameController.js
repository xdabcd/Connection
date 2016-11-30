/**
 *
 * 游戏控制器
 *
 */
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController(scene) {
        _super.call(this, scene);
        this._model = new GameModel(this);
        ControllerManager.instance.register(ControllerID.Game, this);
        this.registerFunc(GameCmd.ADD_SCORE, this.addScore, this);
    }
    var d = __define,c=GameController,p=c.prototype;
    /**
     * 添加得分
     */
    p.addScore = function (score, pos, type) {
        this.scene.showScore(score, pos, type);
    };
    d(p, "model"
        /**
         * 数据
         */
        ,function () {
            return this._model;
        }
    );
    d(p, "scene"
        /**
         * 界面
         */
        ,function () {
            return this._scene;
        }
    );
    return GameController;
}(BaseController));
egret.registerClass(GameController,'GameController');
//# sourceMappingURL=GameController.js.map