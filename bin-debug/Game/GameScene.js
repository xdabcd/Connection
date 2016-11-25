/**
 *
 * 游戏界面
 *
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
        this._controller = new GameController(this);
    }
    var d = __define,c=GameScene,p=c.prototype;
    /**
     * 初始化
     */
    p.init = function () {
        this.addChild(this._topBg = DisplayUtils.createBitmap("bg_png"));
        AnchorUtils.setAnchorX(this._topBg, 0.5);
        this.addChild(this._grid = new Grid);
        AnchorUtils.setAnchorX(this._grid, 0.5);
        AnchorUtils.setAnchorY(this._grid, 1);
        this.addChild(this._timeBg = DisplayUtils.createBitmap("time_bg_png"));
        AnchorUtils.setAnchorX(this._timeBg, 0.5);
        AnchorUtils.setAnchorY(this._timeBg, 1);
    };
    /**
     * 屏幕尺寸变化时调用
     */
    p.onResize = function () {
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;
        this._topBg.x = w / 2;
        this._grid.x = w / 2;
        this._grid.y = h;
        this._timeBg.x = w / 2;
        this._timeBg.y = h - this._grid.height + 5;
    };
    /**
     * 打开
     */
    p.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        _super.prototype.open.call(this);
        this.onResize();
        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_START);
    };
    /**
     * 关闭
     */
    p.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        _super.prototype.close.call(this);
    };
    return GameScene;
}(BaseScene));
egret.registerClass(GameScene,'GameScene');
//# sourceMappingURL=GameScene.js.map