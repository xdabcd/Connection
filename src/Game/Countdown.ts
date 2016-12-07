/**
 *
 * 倒计时
 *
 */
class Countdown extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(this._timeBg = DisplayUtils.createBitmap("time_bg_png"));
        AnchorUtils.setAnchor(this._timeBg, 0.5);
        this.addChild(this._timeProgress = DisplayUtils.createBitmap("time_progress_png"));
        AnchorUtils.setAnchor(this._timeProgress, 0.5);
        this._timeProgress.y = 16;
        this._timeProgress.x = -2;
        this.addChild(this._timeMask = new egret.Sprite);
        DrawUtils.drawRect(this._timeMask, this._timeProgress.width, this._timeProgress.height, 0xffffff);
        AnchorUtils.setAnchor(this._timeMask, 0.5);
        this._timeMask.y = this._timeProgress.y;
        this._timeProgress.mask = this._timeMask;

        this.addChild(this._progressBg = new egret.Sprite);
        DrawUtils.drawRect(this._progressBg, this._timeProgress.width * 0.97, this._timeProgress.height * 0.75, 0xffffff);
        AnchorUtils.setAnchor(this._progressBg, 0.5);
        this._progressBg.x = this._timeProgress.x;
        this._progressBg.y = this._timeProgress.y;
        this.swapChildren(this._progressBg, this._timeProgress);

        this.addChild(this._bgMask = new egret.Sprite);
        DrawUtils.drawRect(this._bgMask, this._timeProgress.width, this._timeProgress.height, 0xffffff);
        AnchorUtils.setAnchor(this._bgMask, 0.5);
        this._bgMask.y = this._timeProgress.y;
        this._progressBg.mask = this._bgMask;

        this.addChild(this._text = new Label);
        this._text.width = 200;
        AnchorUtils.setAnchorX(this._text, 0.5);
        AnchorUtils.setAnchorY(this._text, 0.3);
        this._text.y = this._timeProgress.y + 15;
        this._text.size = 32;
        this._text.stroke = 3;
        this._text.strokeColor = 0x56527D;

        this.addChild(this._textMask = new Label);
        this._textMask.width = 200;
        AnchorUtils.setAnchorX(this._textMask, 0.5);
        AnchorUtils.setAnchorY(this._textMask, 0.3);
        this._textMask.y = this._timeProgress.y + 15;
        this._textMask.size = 32;
        this._textMask.stroke = 3;
        this._textMask.strokeColor = 0xFFFFFF;
        this._textMask.alpha = 0;

        this.addChild(this._overText = new Label);
        this._overText.width = 200;
        AnchorUtils.setAnchor(this._overText, 0.5);
        this._overText.x = 10;
        this._overText.y = this._timeProgress.y;
        this._overText.size = 26;
        this._overText.stroke = 3;
        this._overText.text = "Game Over";
        this._overText.visible = false;

        TimerManager.doFrame(1, 0, this.update, this);
    }

    private _timeBg: egret.Bitmap;
    private _timeProgress: egret.Bitmap;
    private _timeMask: egret.Sprite;
    private _progressBg: egret.Sprite;
    private _bgMask: egret.Sprite;
    private _curTime: number;
    private _topTime: number;
    private _per: number;
    private _text: Label;
    private _textMask: Label;
    private _ct: string;
    private _overText: Label;

    public init(top: number) {
        this._topTime = top;
        this.setTime(top);
    }

    private update(delta: number) {
        var cur = this._curTime ? this._curTime : 0;
        var top = this._topTime ? this._topTime : 1;
        var cp = cur / top;
        var per = this._per ? this._per : 0;

        cp = Math.max(0, cp);
        this.setProgressBg(cp);

        per = Math.min(cp, per + delta / 500, 1);
        this.setProgress(per);
        this._per = per;
    }

    public setTime(time: number) {
        this._curTime = time;
    }

    public over() {
        var tw1 = new Tween(this._text);
        tw1.to = { scaleX: 0.35, scaleY: 0.35, alpha: 0 };
        tw1.duration = 400;
        tw1.ease = TweenEase.BackIn;
        tw1.callBack = () => {
            this._text.visible = false;
        }
        tw1.start();

        this._overText.visible = true;
        this._overText.scaleX = this._overText.scaleY = 0.35;
        this._overText.alpha = 0;
        var tw2 = new Tween(this._overText);
        tw2.to = { scaleX: 1, scaleY: 1, alpha: 1 };
        tw2.updateFunc = () => {
            if (this._overText.alpha > 1) {
                this._overText.alpha = 1;
            }
        }
        tw2.duration = 400;
        tw2.delay = 300;
        tw2.ease = TweenEase.BackOut;
        tw2.start();
    }

    private setProgress(per: number) {
        this._timeMask.x = -this._timeProgress.width * (1 - per) + this._timeProgress.x;
        var top = this._topTime ? this._topTime : 1;
        var time = Math.round(top * per);
        if (time <= 3 && time > 0 && parseInt(this._ct) > time) {
            this.blink();
        }
        this._ct = time.toString();
        this._text.text = DateUtils.getFormatBySecond(time, 3);
    }

    private setProgressBg(per: number) {
        this._bgMask.x = -this._timeProgress.width * (1 - per) + this._timeProgress.x;
    }

    private blink() {
        this._textMask.alpha = 1;
        this._textMask.text = this._text.text;
        this._text.scaleX = this._text.scaleY = 1.5;
        this._textMask.scaleX = this._textMask.scaleY = 1.5;

        var tw1 = new Tween(this._textMask);
        tw1.to = { scaleX: 1, scaleY: 1, alpha: 0 };
        tw1.duration = 300;
        tw1.start();

        var tw1 = new Tween(this._text);
        tw1.to = { scaleX: 1, scaleY: 1 };
        tw1.duration = 300;
        tw1.start();
    }

    /**
     * 销毁
     */
    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}