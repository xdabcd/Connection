/**
 * 
 * 游戏数据
 * 
 */
class GameModel extends BaseModel {
    private _score: number;
    private _times: number;
    private _countdown: number = 0;
    private _updateTime: boolean;
    private _isFire: boolean;
    private _fireTime: number;

    /**
	 * 开始
	 */
    public start() {
        this._updateTime = false;
        this._isFire = false;
        this.setTimeout(300, () => this.showTimeStart());
        this.setTimeout(1200, () => {
            this.initTime();
        });
        this.setTimeout(1800, () => {
            this._countdown = GameData.countdown;
            this._updateTime = true;
            this.showGO();
        });

        this._score = 0;
        this._times = 0;
        this.updateScore();
    }

    /**
     * 进入爆炸模式
     */
    public fire() {
        this._isFire = true;
        this._fireTime = 10;
    }

    /**
     * 爆炸模式结束
     */
    public fireOver() {
        this._isFire = false;
        this.applyControllerFunc(ControllerID.Grid, GameCmd.FIRE_OVER);
    }

    /**
     * 添加得分
     */
    public addScore(delay: number, score: number, callBack: Function) {
        score *= this._times + (this._isFire ? 10 : 0);
        this.setTimeout(delay + 1200, () => {
            if (this._score < 10000 && this._score + score >= 10000) {
                this.applyFunc(GameCmd.RISE_RANK, 1);
            } else if (this._score < 100000 && this._score + score >= 100000) {
                this.applyFunc(GameCmd.RISE_RANK, 2);
            }
            this._score += score;
            this.updateScore(true);
        });
        this.setTimeout(delay, () => callBack(score));
    }

    /**
     * 增加时间
     */
    public addTime(): number {
        this.setTimeout(500, () => {
            this._countdown += 5;
        });
        return 5;
    }

    /**
     * 增加倍率
     */
    public addTimes(delay: number, callBack: Function) {
        this._times += 1;
        this.setTimeout(delay, () => callBack(this._times));
    }


    /**
     * 更新
     */
    protected update(delta: number) {
        super.update(delta);

        if (this._updateTime) {
            if (this._isFire) {
                this._fireTime -= delta / 1000;
                if (this._fireTime <= 0) {
                    this.fireOver();
                }
            } else {
                this._countdown -= delta / 1000;
                if (this._countdown <= 0) {
                    this.gameOver();
                    this._updateTime = false;
                }
            }
            this.updateTime();
        }
    }

    /**
     * 显示计时开始
     */
    private showTimeStart() {
        this.applyFunc(GameCmd.SHOW_TIME_START);
    }

    /**
     * 初始化倒计时
     */
    private initTime() {
        this.applyFunc(GameCmd.TIME_INIT, GameData.countdown);
    }

    /**
     * 显示GO
     */
    private showGO() {
        this.applyFunc(GameCmd.SHOW_GO);
    }

    /**
     * 更新时间
     */
    private updateTime() {
        this.applyFunc(GameCmd.UPDATE_TIME, this._countdown);
    }

    /**
     * 更新分数
     */
    private updateScore(isAdd: boolean = false) {
        this.applyFunc(GameCmd.UPDATE_SCORE, this._score, isAdd);
    }

    /**
     * 游戏结束
     */
    private gameOver() {
        this.applyFunc(GameCmd.GAME_OVER);
        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_OVER);
    }
}