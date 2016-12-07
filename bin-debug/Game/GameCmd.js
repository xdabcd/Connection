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
    GameCmd.SHOW_GO = "show_go";
    GameCmd.UPDATE_TIME = "update_time";
    GameCmd.UPDATE_SCORE = "update_score";
    GameCmd.UPDATE_TIMES = "update_times";
    GameCmd.ADD_SCORE = "add_score";
    return GameCmd;
}());
egret.registerClass(GameCmd,'GameCmd');
//# sourceMappingURL=GameCmd.js.map