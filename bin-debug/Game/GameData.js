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
            return 8;
        }
    );
    d(GameData, "tileSize"
        /** 格子大小 */
        ,function () {
            return 92;
        }
    );
    /**
     * 计算消除得分
     */
    GameData.cacuScore = function (cnt) {
        var score = 0;
        cnt -= 2;
        if (cnt >= 1 && cnt <= 8) {
            score = cnt * 10;
        }
        else if (cnt <= 16) {
            score = cnt * 100;
        }
        else if (cnt <= 24) {
            score = cnt * 1000;
        }
        else if (cnt <= 32) {
            score = cnt * 10000;
        }
        else if (cnt <= 40) {
            score = (cnt - 1) * 50000 + 100000;
        }
        else if (cnt <= 48) {
            score = (cnt - 1) * 100000 + 500000;
        }
        else if (cnt <= 54) {
            score = (cnt - 1) * 500000 + 1500000;
        }
        return score;
    };
    /**
     * 计算效果得分
     */
    GameData.cacuEffectScore = function (effect, cnt) {
        var score = 0;
        switch (effect) {
            case TileEffect.BOMB:
                score = 20 * cnt;
                break;
            case TileEffect.CROSS:
                score = 100 * cnt;
                break;
            case TileEffect.KIND:
                score = 1000 * cnt;
                break;
            case TileEffect.RANDOM:
                score = 20000 * cnt;
                break;
        }
        return score;
    };
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