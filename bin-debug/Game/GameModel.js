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
        this._isFire = false;
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
        this._times = 0;
        this.updateScore();
    };
    /**
     * 进入爆炸模式
     */
    p.fire = function () {
        this._isFire = true;
        this._fireTime = 10;
    };
    /**
     * 爆炸模式结束
     */
    p.fireOver = function () {
        this._isFire = false;
        this.applyControllerFunc(ControllerID.Grid, GameCmd.FIRE_OVER);
    };
    /**
     * 添加得分
     */
    p.addScore = function (delay, score, callBack) {
        var _this = this;
        score *= this._times + (this._isFire ? 10 : 0);
        this.setTimeout(delay + 1200, function () {
            _this._score += score;
            _this.updateScore(true);
        });
        this.setTimeout(delay, function () { return callBack(score); });
    };
    /**
     * 增加时间
     */
    p.addTime = function () {
        var _this = this;
        this.setTimeout(500, function () {
            _this._countdown += 5;
        });
        return 5;
    };
    /**
     * 增加倍率
     */
    p.addTimes = function (delay, callBack) {
        var _this = this;
        this._times += 1;
        this.setTimeout(delay, function () { return callBack(_this._times); });
    };
    /**
     * 更新
     */
    p.update = function (delta) {
        _super.prototype.update.call(this, delta);
        if (this._updateTime) {
            if (this._isFire) {
                this._fireTime -= delta / 1000;
                if (this._fireTime <= 0) {
                    this.fireOver();
                }
            }
            else {
                this._countdown -= delta / 1000;
                if (this._countdown <= 0) {
                    this.gameOver();
                    this._updateTime = false;
                }
            }
            this.updateTime();
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