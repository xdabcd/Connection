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
        this.registerFunc(GameCmd.GAME_START, this.gameStart, this);
        this.registerFunc(GameCmd.GAME_OVER, this.gameOver, this);
        this.registerFunc(GameCmd.SHOW_TIME_START, this.showTimeStart, this);
        this.registerFunc(GameCmd.TIME_INIT, this.initTime, this);
        this.registerFunc(GameCmd.SHOW_GO, this.showGO, this);
        this.registerFunc(GameCmd.UPDATE_TIME, this.updateTime, this);
        this.registerFunc(GameCmd.UPDATE_SCORE, this.updateScore, this);
        this.registerFunc(GameCmd.UPDATE_TIMES, this.updateTimes, this);
        this.registerFunc(GameCmd.ADD_SCORE, this.addScore, this);
    }
    var d = __define,c=GameController,p=c.prototype;
    /**
     * 游戏开始
     */
    p.gameStart = function () {
        this.model.start();
    };
    /**
     * 游戏结束
     */
    p.gameOver = function () {
        this.scene.gameOver();
    };
    /**
     * 计时开始
     */
    p.showTimeStart = function () {
        this.scene.showTimeStart();
    };
    /**
     * 初始化倒计时
     */
    p.initTime = function (top) {
        this.scene.initTime(top);
    };
    /**
     * 显示GO
     */
    p.showGO = function () {
        this.scene.showGO();
    };
    /**
     * 更新倒计时
     */
    p.updateTime = function (time) {
        this.scene.updateTime(time);
    };
    /**
     * 更新得分
     */
    p.updateScore = function (score, isAdd) {
        if (isAdd === void 0) { isAdd = false; }
        this.scene.updateScore(score, isAdd);
    };
    /**
     * 更新倍数
     */
    p.updateTimes = function (times) {
        this.scene.updateTimes(times);
    };
    /**
     * 添加得分
     */
    p.addScore = function (score, pos, type) {
        this.scene.showScore(this.model.addScore(score), pos, type);
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