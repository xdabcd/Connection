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
        this.addChild(this._grid = new Grid);
    };
    /**
     * 屏幕尺寸变化时调用
     */
    p.onResize = function () {
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;
        this._grid.x = w / 2;
        this._grid.y = h / 2;
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