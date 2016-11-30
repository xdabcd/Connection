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
    }
    var d = __define,c=GridController,p=c.prototype;
    /**
     * 开始
     */
    p.start = function () {
        this.model.start();
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