/**
 * 
 * 特效
 * 
 */
class Fx extends egret.Sprite {
    private _callBack: Function;
    protected anim: egret.MovieClip;
    private _fr: number;

    public constructor() {
        super();
        this.init();
        TimerManager.doFrame(1, 0, this.update, this);
    }

    protected init() {

    }

    protected update(delta: number) {
        if (this.anim) {
            if (!this._fr) {
                this._fr = this.anim.frameRate;
            } else {
                this.anim.frameRate = TimerManager.getTimeScale() * this._fr;
            }
        }
    }

    public play() {
        this.visible = true;
    }

    public stopAtFirstFrame() {
        this.visible = true;
    }

    public setCallBack(func: Function) {
        this._callBack = func;
    }

    protected onComplete() {
        this.visible = false;
        this.destroy();
        if (this._callBack) {
            this._callBack();
        }
    }

    public destroy() {
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}