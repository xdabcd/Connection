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

    /**
	 * 开始
	 */
    public start() {
        this._updateTime = false;
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
        this._times = 1;
        this.updateScore();
        this.updateTimes();
    }

    /**
     * 添加得分
     */
    public addScore(score: number): number {
        score *= this._times;
        this.setTimeout(1200, () => {
            this._score += score;
            this.updateScore(true);
        });
        return score;
    }


    /**
     * 更新
     */
    protected update(delta: number) {
        super.update(delta);

        if (this._updateTime) {
            this._countdown -= delta / 1000;
            this.updateTime();
            if (this._countdown <= 0) {
                this.gameOver();
                this._updateTime = false;
            }
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
     * 更新倍数
     */
    private updateTimes() {
        this.applyFunc(GameCmd.UPDATE_TIMES, this._times);
    }

    /**
     * 游戏结束
     */
    private gameOver() {
        this.applyFunc(GameCmd.GAME_OVER);
        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_OVER);
    }
}