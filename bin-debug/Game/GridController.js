/**
 *
 * 棋盘控制器
 *
 */
var GridController = (function (_super) {
    __extends(GridController, _super);
    function GridController(scene) {
        _super.call(this, scene);
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
    var d = __define,c=GridController,p=c.prototype;
    /**
     * 开始
     */
    p.start = function () {
        this.model.start();
    };
    /**
     * 结束
     */
    p.over = function () {
        this.model.over();
    };
    /**
     * 点击格子
     */
    p.touchTile = function (pos) {
        this.model.touchTile(pos);
    };
    /**
     * 触摸结束
     */
    p.touchEnd = function () {
        this.model.touchEnd();
    };
    /**
     * 新增一行
     */
    p.newRow = function (arr) {
        this.scene.newRow(arr);
    };
    /**
     * 进入爆炸模式
     */
    p.fire = function () {
        this.scene.showFire();
    };
    /**
     * 爆炸模式结束
     */
    p.fireOver = function () {
        this.model.fireOver();
        this.scene.hideFire();
    };
    /**
     * 创建格子
     */
    p.createTile = function (tileData) {
        this.scene.createTile(tileData);
    };
    /**
     * 移除格子
     */
    p.removeTile = function (tileData, duration) {
        this.scene.removeTile(tileData, duration);
    };
    /**
     * 击中格子
     */
    p.hitTile = function (tileData, duration, direction) {
        this.scene.hitTile(tileData, duration, direction);
    };
    /**
     * 显示宝箱
     */
    p.showChests = function () {
        this.scene.showChests();
    };
    /**
     * 隐藏宝箱
     */
    p.hideChests = function () {
        this.scene.hideChests();
    };
    /**
     * 解锁宝箱
     */
    p.unlockChest = function (pos, type) {
        this.scene.unlockChest(pos, type);
    };
    /**
     * 震动
     */
    p.shake = function () {
        this.scene.shake();
    };
    /**
     * 震动格子
     */
    p.shakeTile = function (tileData, src) {
        this.scene.shakeTile(tileData, src);
    };
    /**
     * 标记
     */
    p.signTiles = function (arr) {
        this.scene.signTiles(arr);
    };
    /**
     * 设置选择光环
     */
    p.setSelect = function (pos, type) {
        this.scene.setSelect(pos, type);
    };
    /**
     * 连接
     */
    p.connectTile = function (src, dest, hl) {
        this.scene.connectTile(src, dest, hl);
    };
    /**
     * 选中格子
     */
    p.selectTile = function (tileData, hl) {
        this.scene.selectTile(tileData, hl);
    };
    /**
     * 取消选中格子
     */
    p.unselectTile = function (tileData) {
        this.scene.unselectTile(tileData);
    };
    /**
     * 移动格子
     */
    p.moveTile = function (moveInfo) {
        this.scene.moveTile(moveInfo);
    };
    /**
     * 转换格子效果
     */
    p.changeTileEffect = function (tileData) {
        this.scene.changeTileEffect(tileData);
    };
    /**
     * 转换格子类型
     */
    p.changeTileType = function (tileData) {
        this.scene.changeTileType(tileData);
    };
    /**
     * 转换格子倍率
     */
    p.changeTileTimes = function (tileData) {
        this.scene.changeTileTimes(tileData);
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
    return GridController;
}(BaseController));
egret.registerClass(GridController,'GridController');
//# sourceMappingURL=GridController.js.map