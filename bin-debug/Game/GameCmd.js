/**
 *
 * 游戏命令集
 *
 */
var GameCmd = (function () {
    function GameCmd() {
    }
    var d = __define,c=GameCmd,p=c.prototype;
    GameCmd.GAME_START = "game_start";
    GameCmd.GAME_OVER = "game_over";
    GameCmd.SHOW_TIME_START = "time_start";
    GameCmd.TIME_INIT = "time_init";
    GameCmd.SHOW_UNLOCK = "show_unlock";
    GameCmd.SHOW_GO = "show_go";
    GameCmd.SHOW_PRAISE = "show_praise";
    GameCmd.UPDATE_TIME = "update_time";
    GameCmd.UPDATE_SCORE = "update_score";
    GameCmd.ADD_SCORE = "add_score";
    GameCmd.ADD_TIME = "add_time";
    GameCmd.ADD_TIMES = "add_times";
    GameCmd.FIRE = "fire";
    GameCmd.FIRE_OVER = "fire_over";
    return GameCmd;
}());
egret.registerClass(GameCmd,'GameCmd');
//# sourceMappingURL=GameCmd.js.map