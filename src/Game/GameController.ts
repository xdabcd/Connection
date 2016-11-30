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

		this.registerFunc(GameCmd.ADD_SCORE, this.addScore, this);
	}


	/**
	 * 添加得分
	 */
	private addScore(score: number, pos: Vector2, type: number) {
		this.scene.showScore(score, pos, type);
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