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
        this.registerFunc(GameCmd.SHOW_UNLOCK, this.showUnlock, this);
        this.registerFunc(GameCmd.SHOW_PRAISE, this.showPraise, this);
        this.registerFunc(GameCmd.SHOW_LAST_AWARD, this.showLastAward, this);
        this.registerFunc(GameCmd.AWARD, this.award, this);
        this.registerFunc(GameCmd.SHOW_TIME_UP, this.showTimeUp, this);
        this.registerFunc(GameCmd.UPDATE_TIME, this.updateTime, this);
        this.registerFunc(GameCmd.UPDATE_SCORE, this.updateScore, this);
        this.registerFunc(GameCmd.ADD_TIMES, this.addTimes, this);
        this.registerFunc(GameCmd.RISE_RANK, this.riseRank, this);
        this.registerFunc(GameCmd.FIRE, this.fire, this);
        this.registerFunc(GameCmd.ADD_SCORE, this.addScore, this);
        this.registerFunc(GameCmd.ADD_TIME, this.addTime, this);
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
     * 显示时间完了
     */
    p.showTimeUp = function () {
        this.scene.showTimesUp();
    };
    /**
     * 进入爆炸模式
     */
    p.fire = function () {
        this.model.fire();
        this.scene.showFire();
    };
    /**
     * 显示解锁
     */
    p.showUnlock = function () {
        this.scene.showUnlock();
    };
    /**
     * 显示GO
     */
    p.showGO = function () {
        this.scene.showGO();
    };
    /**
     * 显示称赞
     */
    p.showPraise = function (type) {
        this.scene.showPraise(type);
    };
    /**
     * 显示最后的奖励
     */
    p.showLastAward = function () {
        this.scene.showLastAward();
    };
    /**
     * 奖励
     */
    p.award = function (pos, effect, times) {
        this.scene.award(pos, effect, times);
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
     * 得分晋级
     */
    p.riseRank = function (rank) {
        this.scene.riseRank(rank);
    };
    /**
     * 增加倍率
     */
    p.addTimes = function (delay, pos, ts) {
        var _this = this;
        this.model.addTimes(delay, function (times) {
            if (pos) {
                _this.scene.addTimes(times, pos, ts);
            }
            else {
                _this.scene.updateTimes(times);
            }
        });
    };
    /**
     * 添加得分
     */
    p.addScore = function (delay, score, pos, type) {
        var _this = this;
        this.model.addScore(delay, score, function (score) {
            _this.scene.showScore(score, pos, type);
        });
    };
    /**
     * 添加时间
     */
    p.addTime = function () {
        this.model.addTime();
        this.scene.showAddTime();
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