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
    public effect: number = TileEffect.NONE;

    private _id: number;
    private static cnt: number = 0;
    public constructor() {
        this._id = TileData.cnt;
        TileData.cnt += 1;
    }
    public get id(): number {
        return this._id;
    }

    public clone(): TileData {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.effect = this.effect;
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