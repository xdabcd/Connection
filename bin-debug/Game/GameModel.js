/**
 *
 * 游戏数据
 *
 */
var GameModel = (function (_super) {
    __extends(GameModel, _super);
    function GameModel() {
        _super.apply(this, arguments);
        this._countdown = 0;
    }
    var d = __define,c=GameModel,p=c.prototype;
    /**
     * 开始
     */
    p.start = function () {
        var _this = this;
        this._updateTime = false;
        this.setTimeout(300, function () { return _this.showTimeStart(); });
        this.setTimeout(1200, function () {
            _this.initTime();
        });
        this.setTimeout(1800, function () {
            _this._countdown = GameData.countdown;
            _this._updateTime = true;
            _this.showGO();
        });
        this._score = 0;
        this._times = 1;
        this.updateScore();
        this.updateTimes();
    };
    /**
     * 添加得分
     */
    p.addScore = function (score) {
        var _this = this;
        score *= this._times;
        this.setTimeout(1200, function () {
            _this._score += score;
            _this.updateScore(true);
        });
        return score;
    };
    /**
     * 更新
     */
    p.update = function (delta) {
        _super.prototype.update.call(this, delta);
        if (this._updateTime) {
            this._countdown -= delta / 1000;
            this.updateTime();
            if (this._countdown <= 0) {
                this.gameOver();
                this._updateTime = false;
            }
        }
    };
    /**
     * 显示计时开始
     */
    p.showTimeStart = function () {
        this.applyFunc(GameCmd.SHOW_TIME_START);
    };
    /**
     * 初始化倒计时
     */
    p.initTime = function () {
        this.applyFunc(GameCmd.TIME_INIT, GameData.countdown);
    };
    /**
     * 显示GO
     */
    p.showGO = function () {
        this.applyFunc(GameCmd.SHOW_GO);
    };
    /**
     * 更新时间
     */
    p.updateTime = function () {
        this.applyFunc(GameCmd.UPDATE_TIME, this._countdown);
    };
    /**
     * 更新分数
     */
    p.updateScore = function (isAdd) {
        if (isAdd === void 0) { isAdd = false; }
        this.applyFunc(GameCmd.UPDATE_SCORE, this._score, isAdd);
    };
    /**
     * 更新倍数
     */
    p.updateTimes = function () {
        this.applyFunc(GameCmd.UPDATE_TIMES, this._times);
    };
    /**
     * 游戏结束
     */
    p.gameOver = function () {
        this.applyFunc(GameCmd.GAME_OVER);
        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_OVER);
    };
    return GameModel;
}(BaseModel));
egret.registerClass(GameModel,'GameModel');
//# sourceMappingURL=GameModel.js.map