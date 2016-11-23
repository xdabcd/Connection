/**
 *
 * 数据配置
 *
 */
var GameData = (function () {
    function GameData() {
    }
    var d = __define,c=GameData,p=c.prototype;
    d(GameData, "hor"
        /** 横向大小 */
        ,function () {
            return 7;
        }
    );
    d(GameData, "ver"
        /** 纵向个数 */
        ,function () {
            return 7;
        }
    );
    d(GameData, "tileSize"
        /** 格子大小 */
        ,function () {
            return 80;
        }
    );
    /**
     * 获取格子颜色 (1: 2: 3: 4: )
     */
    GameData.getTileColor = function (type) {
        var arr = [0, 0x7DC9FD, 0xF45658, 0xFDBF3F, 0xB775D9];
        return arr[type];
    };
    return GameData;
}());
egret.registerClass(GameData,'GameData');
//# sourceMappingURL=GameData.js.map