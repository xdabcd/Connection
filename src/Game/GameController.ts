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

		this.registerFunc(GameCmd.UPDATE_TIME, this.updateTime, this);
		this.registerFunc(GameCmd.UPDATE_SCORE, this.updateScore, this);
		this.registerFunc(GameCmd.UPDATE_TIMES, this.updateTimes, this);

		this.registerFunc(GameCmd.ADD_SCORE, this.addScore, this);
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
	 * 显示GO
	 */
	private showGO() {
		this.scene.showGO();
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
	 * 更新倍数
	 */
	private updateTimes(times: number) {
		this.scene.updateTimes(times);
	}

	/**
	 * 添加得分
	 */
	private addScore(score: number, pos: Vector2, type: number) {
		this.scene.showScore(this.model.addScore(score), pos, type);
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