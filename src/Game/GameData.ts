/**
 * 
 * 数据配置
 * 
 */
class GameData {
	/** 字体 */
	public static get font(): string {
		return "Cookies";
	}

	/** 倒计时 */
	public static get countdown(): number {
		return 60;
	}

	/** 横向大小 */
	public static get hor(): number {
		return 7;
	}

	/** 纵向个数 */
	public static get ver(): number {
		return 8;
	}

	/** 格子大小 */
	public static get tileSize(): number {
		return 90;
	}

	/**
	 * 计算消除得分
	 */
	public static cacuScore(cnt: number): number {
		var score = 0;
		cnt -= 2;
		if (cnt >= 1 && cnt <= 8) {
			score = cnt * 10;
		} else if (cnt <= 16) {
			score = cnt * 100;
		} else if (cnt <= 24) {
			score = cnt * 1000;
		} else if (cnt <= 32) {
			score = cnt * 10000;
		} else if (cnt <= 40) {
			score = (cnt - 1) * 50000 + 100000;
		} else if (cnt <= 48) {
			score = (cnt - 1) * 100000 + 500000;
		} else if (cnt <= 54) {
			score = (cnt - 1) * 500000 + 1500000;
		}
		return score;
	}

	/**
	 * 计算效果得分
	 */
	public static cacuEffectScore(effect: TileEffect, cnt: number): number {
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
				break
		}
		return score;
	}

	/**
	 * 钥匙得分
	 */
	public static get keyScore(): number {
		return 200;
	}

	/**
	 * 倍数得分
	 */
	public static get timesScore(): number {
		return 1000;
	}

	/** 
	 * 获取格子颜色 (1: 2: 3: 4: )
	 */
	public static getTileColor(type: number): number {
		var arr = [0, 0x7DC9FD, 0xF45658, 0xFDBF3F, 0xB775D9];
		return arr[type];
	}
}