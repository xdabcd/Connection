/**
 *
 * 棋盘命令集
 *
 */
var GridCmd = (function () {
    function GridCmd() {
    }
    var d = __define,c=GridCmd,p=c.prototype;
    GridCmd.TOUCH_TILE = "touch_tile";
    GridCmd.TOUCH_END = "touch_end";
    GridCmd.TILE_CREATE = "tile_create";
    GridCmd.TILE_REMOVE = "tile_remove";
    GridCmd.TILE_SELECT = "tile_select";
    GridCmd.TILE_UNSELECT = "tile_unselect";
    GridCmd.TILE_MOVE = "tile_move";
    GridCmd.TILE_CHANGE_EFFECT = "tile_change_effect";
    GridCmd.TILE_CHANGE_TYPE = "tile_change_type";
    return GridCmd;
}());
egret.registerClass(GridCmd,'GridCmd');
//# sourceMappingURL=GridCmd.js.map