/**
 * 
 * 棋盘命令集
 * 
 */
class GridCmd {
	public static TOUCH_TILE: string = "touch_tile";
	public static TOUCH_END: string = "touch_end";

	public static TILE_CREATE: string = "tile_create";
	public static TILE_REMOVE: string = "tile_remove";
	public static TILE_HIT: string = "tile_hit";
	public static TILE_SHAKE: string = "tile_shake";
	public static TILE_SIGN: string = "tile_sign";
	public static TILE_CONNECT: string = "tile_connect";
	public static TILE_SELECT: string = "tile_select";
	public static TILE_UNSELECT: string = "tile_unselect";
	public static TILE_MOVE: string = "tile_move";
	public static TILE_CHANGE_EFFECT: string = "tile_change_effect";
	public static TILE_CHANGE_TYPE: string = "tile_change_type";
	public static TILE_CHANGE_TIMES: string = "tile_change_times";

	public static NEW_ROW: string = "new_row";

	public static SET_SELECT: string = "set_select";
	public static SHAKE: string = "shake";
	public static SHOW_CHESTS: string = "show_chests";
	public static HIDE_CHESTS: string = "hide_chests";
	public static UNLOCK_CHEST: string = "unlock_chest";
}