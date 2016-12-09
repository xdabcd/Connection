/**
 * 
 * 棋盘控制器
 * 
 */
class GridController extends BaseController {
	public constructor(scene: Grid) {
		super(scene);
		this._model = new GridModel(this);
		ControllerManager.instance.register(ControllerID.Grid, this);

		/** V->M */
		this.registerFunc(GameCmd.GAME_START, this.start, this);
		this.registerFunc(GameCmd.GAME_OVER, this.over, this);
		this.registerFunc(GridCmd.TOUCH_TILE, this.touchTile, this);
		this.registerFunc(GridCmd.TOUCH_END, this.touchEnd, this);

		/** M->V */
		this.registerFunc(GridCmd.TILE_CREATE, this.createTile, this);
		this.registerFunc(GridCmd.TILE_REMOVE, this.removeTile, this);
		this.registerFunc(GridCmd.TILE_HIT, this.hitTile, this);
		this.registerFunc(GridCmd.TILE_SHAKE, this.shakeTile, this);
		this.registerFunc(GridCmd.TILE_SIGN, this.signTiles, this);
		this.registerFunc(GridCmd.TILE_CONNECT, this.connectTile, this);
		this.registerFunc(GridCmd.TILE_SELECT, this.selectTile, this);
		this.registerFunc(GridCmd.TILE_UNSELECT, this.unselectTile, this);
		this.registerFunc(GridCmd.TILE_MOVE, this.moveTile, this);
		this.registerFunc(GridCmd.TILE_CHANGE_EFFECT, this.changeTileEffect, this);
		this.registerFunc(GridCmd.TILE_CHANGE_TYPE, this.changeTileType, this);
		this.registerFunc(GridCmd.TILE_CHANGE_TIMES, this.changeTileTimes, this);

		this.registerFunc(GridCmd.NEW_ROW, this.newRow, this);
		this.registerFunc(GameCmd.FIRE, this.fire, this);
		this.registerFunc(GameCmd.FIRE_OVER, this.fireOver, this);

		this.registerFunc(GridCmd.SET_SELECT, this.setSelect, this);
		this.registerFunc(GridCmd.SHAKE, this.shake, this);
		this.registerFunc(GridCmd.SHOW_CHESTS, this.showChests, this);
		this.registerFunc(GridCmd.HIDE_CHESTS, this.hideChests, this);
		this.registerFunc(GridCmd.UNLOCK_CHEST, this.unlockChest, this);
	}

	/**
	 * 开始
	 */
	private start() {
		this.model.start();
	}

	/**
	 * 结束
	 */
	private over() {
		this.model.over();
	}

	/**
	 * 点击格子
	 */
	private touchTile(pos: Vector2) {
		this.model.touchTile(pos);
	}

	/**
	 * 触摸结束
	 */
	private touchEnd() {
		this.model.touchEnd();
	}

	/**
	 * 新增一行
	 */
	private newRow(arr: Array<TileData>) {
		this.scene.newRow(arr);
	}

	/**
	 * 进入爆炸模式
	 */
	private fire() {
		this.scene.showFire();
	}

	/**
	 * 爆炸模式结束
	 */
	private fireOver() {
		this.model.fireOver();
		this.scene.hideFire();
	}

	/**
	 * 创建格子
	 */
	private createTile(tileData: TileData) {
		this.scene.createTile(tileData);
	}

	/**
	 * 移除格子
	 */
	private removeTile(tileData: TileData, duration: number) {
		this.scene.removeTile(tileData, duration);
	}

	/**
	 * 击中格子
	 */
	private hitTile(tileData: TileData, duration: number, direction: Direction) {
		this.scene.hitTile(tileData, duration, direction);
	}

	/**
	 * 显示宝箱
	 */
	private showChests() {
		this.scene.showChests();
	}

	/**
	 * 隐藏宝箱
	 */
	private hideChests() {
		this.scene.hideChests();
	}

	/**
	 * 解锁宝箱
	 */
	private unlockChest(pos: Vector2, type: number) {
		this.scene.unlockChest(pos, type);
	}

	/**
	 * 震动
	 */
	public shake() {
		this.scene.shake();
	}

	/**
	 * 震动格子
	 */
	public shakeTile(tileData: TileData, src: Vector2) {
		this.scene.shakeTile(tileData, src);
	}

	/**
	 * 标记
	 */
	private signTiles(arr: Array<TileData>) {
		this.scene.signTiles(arr);
	}

	/**
	 * 设置选择光环
	 */
	private setSelect(pos: Vector2, type: number) {
		this.scene.setSelect(pos, type);
	}

	/**
	 * 连接
	 */
	private connectTile(src: TileData, dest: TileData, hl: boolean) {
		this.scene.connectTile(src, dest, hl);
	}

	/**
	 * 选中格子
	 */
	private selectTile(tileData: TileData, hl: boolean) {
		this.scene.selectTile(tileData, hl);
	}

	/**
	 * 取消选中格子
	 */
	private unselectTile(tileData: TileData) {
		this.scene.unselectTile(tileData);
	}

	/**
	 * 移动格子
	 */
	private moveTile(moveInfo: MoveInfo) {
		this.scene.moveTile(moveInfo);
	}

	/**
	 * 转换格子效果
	 */
	private changeTileEffect(tileData: TileData) {
		this.scene.changeTileEffect(tileData);
	}

	/**
	 * 转换格子类型
	 */
	private changeTileType(tileData: TileData) {
		this.scene.changeTileType(tileData);
	}

	/**
	 * 转换格子倍率
	 */
	private changeTileTimes(tileData: TileData) {
		this.scene.changeTileTimes(tileData);
	}

	/**
	 * 数据
	 */
	private get model(): GridModel {
		return this._model as GridModel;
	}

	/**
	 * 界面
	 */
	private get scene(): Grid {
		return this._scene as Grid;
	}
}