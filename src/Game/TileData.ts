/**
 * 
 * 格子数据
 * 
 */
class TileData {
    /** 位置 */
    public pos: Vector2;
    /** 类型 */
    public type: number;
    /** 效果 */
    public effect: TileEffect = TileEffect.NONE;
    /** 消失效果 */
    public removeFx: TileRemoveFx = TileRemoveFx.Smoke;
    public info = null;

    public clone(): TileData {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.effect = this.effect;
        data.info = this.info;
        return data;
    }
}

enum TileEffect {
    NONE = 0,
    BOMB = 1,
    CROSS = 2,
    KIND = 3,
    RANDOM = 4
}

enum TileRemoveFx {
    Smoke = 0,
    Thunder = 1
}