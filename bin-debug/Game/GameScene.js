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
    };
    /**
     * 屏幕尺寸变化时调用
     */
    p.onResize = function () {
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
    };
    /**
     * 显示计时开始
     */
    p.showTimeStart = function () {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_time_start_png", 0.5, 0.35);
    };
    /**
     * 初始化倒计时
     */
    p.initTime = function (top) {
        this._countdown.init(top);
    };
    /**
     * 显示GO
     */
    p.showGO = function () {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_go_png", 0.5, 0.35);
    };
    /**
     * 更新倒计时
     */
    p.updateTime = function (time) {
        this._countdown.setTime(time);
    };
    /**
     * 得分晋级
     */
    p.riseRank = function (rank) {
        var _this = this;
        this._topMask.visible = true;
        this._topMask.alpha = 1;
        var tw = new Tween(this._topMask);
        tw.to = { alpha: 0 };
        tw.duration = 200;
        tw.callBack = function () {
            _this._topMask.visible = false;
        };
        tw.start();
        this._scoreBg.texture = RES.getRes("score_bg_" + rank + "_png");
    };
    /**
     * 更新得分
     */
    p.updateScore = function (score, isAdd) {
        if (isAdd === void 0) { isAdd = false; }
        if (isAdd) {
            this.blinkScore("" + score);
        }
        else {
            this._score.text = "" + score;
        }
    };
    /**
     * 得分闪烁
     */
    p.blinkScore = function (text) {
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
        tw5.callBack = function () {
            score.textColor = a;
            score.strokeColor = b;
        };
        tw5.start();
    };
    /**
     * 更新倍数
     */
    p.updateTimes = function (times) {
        if (times == 0) {
            this._times.text = "";
            return;
        }
        this._times.text = "x" + times;
    };
    /**
     * 添加倍数
     */
    p.addTimes = function (times, pos, ts) {
        var _this = this;
        var tr = this._grid.getAbsPosition(pos.x, pos.y);
        var t = ObjectPool.pop("Times");
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
        tw3.callBack = function () {
            t.scaleY = 1;
            t.destroy();
            _this.updateTimes(times);
        };
        tw3.start();
    };
    /**
     * 进入爆炸模式提示
     */
    p.showFire = function () {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_fire_png", 0.5, 0.35);
    };
    /**
     * 显示得分
     */
    p.showScore = function (score, pos, type) {
        var fs = ObjectPool.pop("FloatScore");
        var tp = this._grid.getAbsPosition(pos.x, pos.y);
        fs.x = tp.x;
        fs.y = tp.y;
        this._scoreCon.addChild(fs);
        fs.show(score, type);
    };
    /**
     * 显示增加时间
     */
    p.showAddTime = function () {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_add_time_png", 0.5, 0.35);
    };
    /**
     * 显示宝箱解锁
     */
    p.showUnlock = function () {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show2("hint_unlock_png");
    };
    /**
     * 显示时间完
     */
    p.showTimesUp = function () {
        this._countdown.over();
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show3("hint_times_up_png");
    };
    /**
     * 显示最后的奖励
     */
    p.showLastAward = function () {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show2("hint_hurray_png");
    };
    /**
     * 显示称赞
     */
    p.showPraise = function (type) {
        var hint = ObjectPool.pop("Hint");
        this._hintCon.addChild(hint);
        hint.y = -80;
        hint.show1("hint_praise_" + type + "_png", 0.5, 0.35);
    };
    /**
     * 游戏结束
     */
    p.gameOver = function () {
    };
    /**
     * 奖励
     */
    p.award = function (pos, effect, times) {
        this.updateTimes(times);
        var tr = this._grid.getAbsPosition(pos.x, pos.y);
        var tile = ObjectPool.pop("Tile");
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
        tw3.callBack = function () {
            tile.destroy();
        };
        tw3.start();
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
        this.applyFunc(GameCmd.GAME_START);
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