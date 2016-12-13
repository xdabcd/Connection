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
    private _topMask: egret.Sprite;
    private _scoreBg: egret.Bitmap;
    private _score: Label;
    private _timesBg: egret.Bitmap;
    private _times: Label;
    private _countdown: Countdown;
    private _grid: Grid;
    private _scoreCon: egret.DisplayObjectContainer;
    private _timesCon: egret.DisplayObjectContainer;

    private _hintCon: egret.DisplayObjectContainer;

    /**
     * 初始化
     */
    protected init() {
        this.addChild(this._grid = new Grid);
        AnchorUtils.setAnchorX(this._grid, 0.5);
        AnchorUtils.setAnchorY(this._grid, 1);

        this.addChild(this._topBg = DisplayUtils.createBitmap("bg_png"));
        AnchorUtils.setAnchorX(this._topBg, 0.5);
        this.addChild(this._topMask = new egret.Sprite);
        DrawUtils.drawRect(this._topMask, this._topBg.width, this._topBg.height, 0xffffff);
        AnchorUtils.setAnchorX(this._topMask, 0.5);
        this._topMask.visible = false;

        this.addChild(this._scoreBg = DisplayUtils.createBitmap("score_bg_png"));
        AnchorUtils.setAnchor(this._scoreBg, 0.5);

        this.addChild(this._score = new Label);
        this._score.width = 400;
        this._score.size = 45;
        this._score.stroke = 3;
        AnchorUtils.setAnchorX(this._score, 0.5);

        this.addChild(this._timesBg = DisplayUtils.createBitmap("times_bg_png"));
        AnchorUtils.setAnchor(this._timesBg, 0.5);

        this.addChild(this._times = new Label);
        this._times.width = 120;
        this._times.size = 26;
        this._times.stroke = 3;
        this._times.textColor = 0;
        this._times.strokeColor = 0xFFFFFF;
        AnchorUtils.setAnchorX(this._times, 0.5);

        this.addChild(this._countdown = new Countdown);

        this.addChild(this._scoreCon = new egret.DisplayObjectContainer);
        this.addChild(this._timesCon = new egret.DisplayObjectContainer);
        this.addChild(this._hintCon = new egret.DisplayObjectContainer);
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
        this._topBg.y = 0;
        this._topMask.x = w / 2;
        this._topMask.y = 0;
        this._scoreBg.x = w / 2;
        this._scoreBg.y = 200;
        this._score.x = this._scoreBg.x;
        this._score.y = this._scoreBg.y - 35;
        this._timesBg.x = this._scoreBg.x;
        this._timesBg.y = this._scoreBg.y + 55;
        this._timesBg.visible = false;
        this._times.x = this._timesBg.x;
        this._times.y = this._timesBg.y - 25;
        this._countdown.x = w / 2;
        this._countdown.y = this._topBg.height - 33;

        this._hintCon.x = w / 2;
        this._hintCon.y = this._grid.y - this._grid.height / 2;
    }

    /**
     * 显示计时开始
     */
    public showTimeStart() {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_time_start_png", 0.5, 0.35);
    }

    /**
     * 初始化倒计时
     */
    public initTime(top: number) {
        this._countdown.init(top);
    }

    /**
     * 显示GO
     */
    public showGO() {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_go_png", 0.5, 0.35);
    }

    /**
     * 更新倒计时
     */
    public updateTime(time: number) {
        this._countdown.setTime(time);
    }

    /**
     * 得分晋级
     */
    public riseRank(rank: number) {
        this._topMask.visible = true;
        this._topMask.alpha = 1;
        var tw = new Tween(this._topMask);
        tw.to = { alpha: 0 };
        tw.duration = 200;
        tw.callBack = () => {
            this._topMask.visible = false;
        }
        tw.start();
        this._scoreBg.texture = RES.getRes("score_bg_" + rank + "_png")
    }

    /**
     * 更新得分
     */
    public updateScore(score: number, isAdd: boolean = false) {
        if (isAdd) {
            this.blinkScore("" + score);
        } else {
            this._score.text = "" + score;
        }
    }

    /**
     * 得分闪烁
     */
    public blinkScore(text: string) {
        var score = this._score;
        TweenManager.removeTween(score);

        var a = 0xFFFFFF;
        var b = 0;

        var col0 = 0xFFFEC5;
        var col1 = 0xBB8C9D;
        var col2 = 0xFFFD79;
        var col3 = 0xFFFFFF;

        score.textColor = col0;
        score.strokeColor = col1;

        var tw1 = new Tween(score);
        tw1.duration = 20;
        tw1.start();

        var tw2 = new Tween(score);
        tw2.from = { text: text };
        tw2.delay = tw1.delay + tw1.duration;
        tw2.duration = 70;
        tw2.start();

        var tw3 = new Tween(score);
        tw3.from = { textColor: col2, strokeColor: col3 };
        tw3.delay = tw2.delay + tw2.duration;
        tw3.duration = 90;
        tw3.start();

        var tw4 = new Tween(score);
        tw4.from = { textColor: col0, strokeColor: col1 };
        tw4.delay = tw3.delay + tw3.duration;
        tw4.duration = 90;
        tw4.start();

        var tw5 = new Tween(score);
        tw5.from = { textColor: col2, strokeColor: col3 };
        tw5.delay = tw4.delay + tw4.duration;
        tw5.duration = 40;
        tw5.callBack = () => {
            score.textColor = a;
            score.strokeColor = b;
        }
        tw5.start();
    }


    /**
     * 更新倍数
     */
    public updateTimes(times: number) {
        if (times == 0) {
            this._times.text = "";
            return;
        }
        this._times.text = "x" + times;
    }

    /**
     * 添加倍数
     */
    public addTimes(times: number, pos: Vector2, ts: number) {
        var tr = this._grid.getAbsPosition(pos.x, pos.y);
        var t = ObjectPool.pop("Times") as Times;
        t.setTimes(ts);
        this._timesCon.addChild(t);
        t.x = tr.x;
        t.y = tr.y;
        var tw1 = new Tween(t);
        tw1.to = { y: this._times.y + 5 };
        tw1.duration = 500;
        tw1.start();
        var tw2 = new Tween(t);
        tw2.to = { x: this._times.x };
        tw2.duration = 500;
        tw2.ease = TweenEase.QuadOut;
        tw2.start();
        var tw3 = new Tween(t);
        tw3.to = { scaleY: 0.3 };
        tw3.duration = 500;
        tw3.ease = TweenEase.QuadOut;
        tw3.callBack = () => {
            t.scaleY = 1;
            t.destroy();
            this.updateTimes(times);
        };
        tw3.start();
    }

    /**
     * 进入爆炸模式提示
     */
    public showFire() {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_fire_png", 0.5, 0.35);
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
	 * 显示增加时间
	 */
    public showAddTime() {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_add_time_png", 0.5, 0.35);
    }

    /**
     * 显示宝箱解锁
     */
    public showUnlock() {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show2("hint_unlock_png");
    }

    /**
     * 显示时间完
     */
    public showTimesUp() {
        this._countdown.over();
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show3("hint_times_up_png");
    }

    /**
     * 显示最后的奖励
     */
    public showLastAward() {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show2("hint_hurray_png");
    }

    /**
     * 显示称赞
     */
    public showPraise(type: number) {
        var hint = ObjectPool.pop("Hint") as Hint;
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_praise_" + type + "_png", 0.5, 0.35);
    }

    /**
     * 游戏结束
     */
    public gameOver() {

    }

    /**
     * 奖励
     */
    public award(pos: Vector2, effect: TileEffect, times: number) {
        this.updateTimes(times);
        var tr = this._grid.getAbsPosition(pos.x, pos.y);
        var tile = ObjectPool.pop("Tile") as Tile;
        tile.reset();
        tile.effect = effect;
        tile.setOnTouch(null);
        tile.addTo(this._timesCon);
        tile.x = this._times.x;
        tile.y = this._times.y;
        tile.scaleX = tile.scaleY = 0.3;

        var tw1 = new Tween(tile);
        tw1.to = { y: tr.y };
        tw1.duration = 500;
        tw1.start();
        var tw2 = new Tween(tile);
        tw2.to = { x: tr.x };
        tw2.duration = 500;
        tw2.ease = TweenEase.QuadOut;
        tw2.start();
        var tw3 = new Tween(tile);
        tw3.to = { scaleX: 1, scaleY: 1 };
        tw3.duration = 500;
        tw3.ease = TweenEase.QuadOut;
        tw3.callBack = () => {
            tile.destroy();
        };
        tw3.start();
    }

    /**
     * 打开
     */
    public open(...param: any[]): void {
        super.open();
        this.onResize();

        this.applyFunc(GameCmd.GAME_START);
        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_START);
    }

    /**
     * 关闭
     */
    public close(...param: any[]): void {
        super.close();
    }
}