/**
 *
 * 移动数据
 *
 */
var MoveInfo = (function () {
    function MoveInfo(tileData, targetPos, duration) {
        this.tileData = tileData.clone();
        this.target = targetPos;
        this.duration = duration;
    }
    var d = __define,c=MoveInfo,p=c.prototype;
    return MoveInfo;
}());
egret.registerClass(MoveInfo,'MoveInfo');
//# sourceMappingURL=MoveInfo.js.map