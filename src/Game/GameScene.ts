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
    private _scoreBg: egret.Bitmap;
    private _score: egret.TextField;
    private _timesBg: egret.Bitmap;
    private _times: egret.TextField;
    private _timeBg: egret.Bitmap;
    private _grid: Grid;
    private _scoreCon: egret.DisplayObjectContainer;

    /**
     * 初始化
     */
    protected init() {
        this.addChild(this._grid = new Grid);
        AnchorUtils.setAnchorX(this._grid, 0.5);
        AnchorUtils.setAnchorY(this._grid, 1);

        this.addChild(this._topBg = DisplayUtils.createBitmap("bg_png"));
        AnchorUtils.setAnchorX(this._topBg, 0.5);

        this.addChild(this._scoreBg = DisplayUtils.createBitmap("score_bg_png"));
        AnchorUtils.setAnchor(this._scoreBg, 0.5);

        this.addChild(this._score = new egret.TextField);
        this._score.width = 400;
        this._score.size = 45;
        this._score.textAlign = "center";
        this._score.stroke = 3;
        this._score.fontFamily = "Cookies";
        AnchorUtils.setAnchorX(this._score, 0.5);
        this._score.text = '33232';

        this.addChild(this._timesBg = DisplayUtils.createBitmap("times_bg_png"));
        AnchorUtils.setAnchor(this._timesBg, 0.5);

        this.addChild(this._times = new egret.TextField);
        this._times.width = 120;
        this._times.size = 32;
        this._times.textAlign = "center";
        this._times.stroke = 3;
        this._times.fontFamily = "Cookies";
        this._times.textColor = 0xFEEF46;
        AnchorUtils.setAnchorX(this._times, 0.5);
        this._times.text = 'x10';

        this.addChild(this._timeBg = DisplayUtils.createBitmap("time_bg_png"));
        AnchorUtils.setAnchorX(this._timeBg, 0.5);
        AnchorUtils.setAnchorY(this._timeBg, 1);

        this.addChild(this._scoreCon = new egret.DisplayObjectContainer);
    }

    /**
     * 屏幕尺寸变化时调用
     */
    protected onResize(): void {
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._grid.x = w / 2;
        this._grid.y = h;
        this._topBg.x = w / 2;
        this._topBg.y = - 40;
        this._scoreBg.x = w / 2;
        this._scoreBg.y = 150;
        this._score.x = this._scoreBg.x;
        this._score.y = this._scoreBg.y - 30;
        this._timesBg.x = this._scoreBg.x;
        this._timesBg.y = this._scoreBg.y + 60;
        this._times.x = this._timesBg.x;
        this._times.y = this._timesBg.y - 25;
        this._timeBg.x = w / 2;
        this._timeBg.y = h - this._grid.height + 5;
    }


    /**
	 * 显示得分
	 */
    public showScore(score: number, pos: Vector2, type: number) {
        var fs = ObjectPool.pop("FloatScore") as FloatScore;
        var tp = this._grid.getAbsPosition(pos.x, pos.y);
        fs.x = tp.x;
        fs.y = tp.y;
        this._scoreCon.addChild(fs);
        fs.show(score, type);
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