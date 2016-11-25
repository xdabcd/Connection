/**
 * 
 * 游戏界面
 * 
 */
class GameScene extends BaseScene {
    public constructor() {
        super();
        this._controller = new GameController(this);
    }

    private _topBg: egret.Bitmap;
    private _timeBg: egret.Bitmap;
    private _grid: Grid;

    /**
     * 初始化
     */
    protected init() {
        this.addChild(this._topBg = DisplayUtils.createBitmap("bg_png"));
        AnchorUtils.setAnchorX(this._topBg, 0.5);

        this.addChild(this._grid = new Grid);
        AnchorUtils.setAnchorX(this._grid, 0.5);
        AnchorUtils.setAnchorY(this._grid, 1);

        this.addChild(this._timeBg = DisplayUtils.createBitmap("time_bg_png"));
        AnchorUtils.setAnchorX(this._timeBg, 0.5);
        AnchorUtils.setAnchorY(this._timeBg, 1);
    }

    /**
     * 屏幕尺寸变化时调用
     */
    protected onResize(): void {
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._topBg.x = w / 2;
        this._grid.x = w / 2;
        this._grid.y = h;
        this._timeBg.x = w / 2;
        this._timeBg.y = h - this._grid.height + 5;
    }

    /**
     * 打开
     */
    public open(...param: any[]): void {
        super.open();
        this.onResize();

        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_START);
    }

    /**
     * 关闭
     */
    public close(...param: any[]): void {
        super.close();
    }
}