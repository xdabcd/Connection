/**
 * 
 * 游戏控制器
 * 
 */
class GameController extends BaseController {
	public constructor(scene: GameScene) {
		super(scene);
		this._model = new GameModel(this);
		ControllerManager.instance.register(ControllerID.Game, this);

		this.registerFunc(GameCmd.GAME_START, this.gameStart, this);
		this.registerFunc(GameCmd.GAME_OVER, this.gameOver, this);
		this.registerFunc(GameCmd.SHOW_TIME_START, this.showTimeStart, this);
		this.registerFunc(GameCmd.TIME_INIT, this.initTime, this);
		this.registerFunc(GameCmd.SHOW_GO, this.showGO, this);
		this.registerFunc(GameCmd.SHOW_UNLOCK, this.showUnlock, this);
		this.registerFunc(GameCmd.SHOW_PRAISE, this.showPraise, this);

		this.registerFunc(GameCmd.UPDATE_TIME, this.updateTime, this);
		this.registerFunc(GameCmd.UPDATE_SCORE, this.updateScore, this);
		this.registerFunc(GameCmd.ADD_TIMES, this.addTimes, this);

		this.registerFunc(GameCmd.FIRE, this.fire, this);
		this.registerFunc(GameCmd.ADD_SCORE, this.addScore, this);
		this.registerFunc(GameCmd.ADD_TIME, this.addTime, this);
	}

	/**
	 * 游戏开始
	 */
	private gameStart() {
		this.model.start();
	}

	/**
	 * 游戏结束
	 */
	private gameOver() {
		this.scene.gameOver();
	}

	/**
	 * 计时开始
	 */
	private showTimeStart() {
		this.scene.showTimeStart();
	}

	/**
	 * 初始化倒计时
	 */
	private initTime(top: number) {
		this.scene.initTime(top);
	}

	/**
	 * 进入爆炸模式
	 */
	private fire() {
		this.model.fire();
		this.scene.showFire();
	}

	/**
	 * 显示解锁
	 */
	private showUnlock() {
		this.scene.showUnlock();
	}

	/**
	 * 显示GO
	 */
	private showGO() {
		this.scene.showGO();
	}

	/**
	 * 显示称赞
	 */
	private showPraise(type: number) {
		this.scene.showPraise(type);
	}

	/**
	 * 更新倒计时
	 */
	private updateTime(time: number) {
		this.scene.updateTime(time);
	}

	/**
	 * 更新得分
	 */
	private updateScore(score: number, isAdd: boolean = false) {
		this.scene.updateScore(score, isAdd);
	}

	/**
	 * 增加倍率
	 */
	private addTimes(delay: number, pos: Vector2, ts: number) {
		this.model.addTimes(delay, (times) => {
			if (pos) {
				this.scene.addTimes(times, pos, ts);
			} else {
				this.scene.updateTimes(times);
			}
		});
	}

	/**
	 * 添加得分
	 */
	private addScore(delay: number, score: number, pos: Vector2, type: number) {
		this.model.addScore(delay, score, (score) => {
			this.scene.showScore(score, pos, type);
		});
	}

	/**
	 * 添加时间
	 */
	private addTime() {
		this.model.addTime();
		this.scene.showAddTime();
	}

	/**
	 * 数据
	 */
	private get model(): GameModel {
		return this._model as GameModel;
	}

	/**
	 * 界面
	 */
	private get scene(): GameScene {
		return this._scene as GameScene;
	}
}