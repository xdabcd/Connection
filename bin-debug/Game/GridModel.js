/**
 *
 * 棋盘
 *
 */
var GridModel = (function (_super) {
    __extends(GridModel, _super);
    function GridModel() {
        _super.apply(this, arguments);
        this._interval = 50;
    }
    var d = __define,c=GridModel,p=c.prototype;
    /**
     * 开始
     */
    p.start = function () {
        this.setState(GridState.Start);
        this._hor = GameData.hor;
        this._ver = GameData.ver;
        this._selectArr = [];
        this.initTileList();
    };
    /**
     * 触摸格子
     */
    p.touchTile = function (pos) {
        var tileData = this.getTile(pos.x, pos.y);
        var length = this._selectArr.length;
        if (this.isState(GridState.Idle)) {
            this._selectArr = [tileData];
            this.select(tileData);
            this.setState(GridState.Select);
        }
        else if (this.isState(GridState.Select) && length) {
            if (this.curSelectType == 0 || tileData.type == 0 || this.curSelectType == tileData.type) {
                var idx = this._selectArr.indexOf(tileData);
                var end = this._selectArr[length - 1];
                if (idx < 0 && tileData.pos.borderUpon(end.pos)) {
                    this._selectArr.push(tileData);
                    this.select(tileData);
                }
                else if (idx == length - 2) {
                    ArrayUtils.remove(this._selectArr, end);
                    this.unselect(end);
                }
            }
        }
    };
    /**
     * 触摸结束
     */
    p.touchEnd = function () {
        if (this._selectArr.length >= 3) {
            this.remove();
        }
        else {
            /** 取消 */
            for (var i = 0; i < this._selectArr.length; i++) {
                this.unselect(this._selectArr[i]);
            }
            this.setState(GridState.Idle);
        }
        this._selectArr = [];
    };
    /**
     * 消除
     */
    p.remove = function () {
        var _this = this;
        this.setState(GridState.Remove);
        var removeTime = 0;
        var length = this._selectArr.length;
        for (var i = 0; i < length; i++) {
            var tileData = this._selectArr[i];
            var x = tileData.pos.x;
            var y = tileData.pos.y;
            removeTime = this.delTile(x, y);
        }
        var pos = this._selectArr[length - 1].pos.clone();
        TimerManager.doTimer(removeTime + this._interval, 1, function () {
            _this.addEffect(length, pos);
            _this.repair();
        }, this);
    };
    /**
     * 生成带有效果的格子
     */
    p.addEffect = function (cnt, pos) {
        var effect;
        if (cnt >= 20) {
            effect = TileEffect.RANDOM;
        }
        else if (cnt >= 14) {
            effect = TileEffect.KIND;
        }
        else if (cnt >= 7) {
            effect = TileEffect.CROSS;
        }
        else if (cnt >= 4) {
            effect = TileEffect.BOMB;
        }
        if (effect) {
            this._tileList[pos.x][pos.y] = this.addTile(pos.x, pos.y, 0, effect);
        }
    };
    /**
     * 修复
     */
    p.repair = function () {
        var _this = this;
        var removeArr = [];
        var moveList = [];
        for (var x = 0; x < this._hor; x++) {
            var temp = [];
            removeArr.push(temp);
            for (var y = 0; y < this._ver; y++) {
                if (this._tileList[x][y] == null) {
                    temp.push(y);
                }
            }
        }
        for (var x = 0; x < removeArr.length; x++) {
            var tmpArr = removeArr[x];
            tmpArr.sort(SortUtils.sortNum);
            for (var i = 0; i < tmpArr.length; i++) {
                var tileData = this.addTile(x, i - tmpArr.length);
                moveList.push(this.moveTile(tileData, new Vector2(x, i)));
            }
            for (var y = 0; y < this._ver; y++) {
                if (y < tmpArr[0]) {
                    moveList.push(this.moveTile(this.getTile(x, y), new Vector2(x, y + tmpArr.length)));
                }
                else {
                    tmpArr.shift();
                    if (tmpArr.length == 0)
                        break;
                }
            }
        }
        var moveTime = this.getMaxMoveDuration(moveList);
        TimerManager.doTimer(moveTime + this._interval, 1, function () {
            _this.updateMovePosition(moveList);
            _this.setState(GridState.Idle);
        }, this);
    };
    /**
     * 执行效果
     */
    p.doEffect = function (tileData) {
        var x = tileData.pos.x;
        var y = tileData.pos.y;
        var hor = this._hor;
        var ver = this._ver;
        switch (tileData.effect) {
            case TileEffect.BOMB:
                var minX = Math.max(0, x - 1);
                var maxX = Math.min(hor, x + 2);
                var minY = Math.max(0, y - 1);
                var maxY = Math.min(ver, y + 2);
                for (var i = minX; i < maxX; i++) {
                    for (var j = minY; j < maxY; j++) {
                        this.delTile(i, j);
                    }
                }
                break;
            case TileEffect.CROSS:
                for (var i = 0; i < hor; i++) {
                    this.delTile(i, y);
                }
                for (var i = 0; i < ver; i++) {
                    this.delTile(x, i);
                }
                break;
            case TileEffect.KIND:
                var type = this.curSelectType;
                for (var i = 0; i < hor; i++) {
                    for (var j = 0; j < hor; j++) {
                        var td = this.getTile(i, j);
                        if (td && td.type == type)
                            this.delTile(i, j);
                    }
                }
                break;
            case TileEffect.RANDOM:
                var arr = [];
                for (var i = 0; i < hor; i++) {
                    for (var j = 0; j < hor; j++) {
                        var td = this.getTile(i, j);
                        if (td) {
                            arr.push(td);
                        }
                    }
                }
                arr.sort(SortUtils.random);
                var l = RandomUtils.limitInteger(22, 25);
                l = Math.min(arr.length, l);
                for (var i = 0; i < l; i++) {
                    this.delTile(arr[i].pos.x, arr[i].pos.y);
                }
                break;
        }
    };
    /**
     * 初始化格子列表
     */
    p.initTileList = function () {
        this._tileList = [];
        for (var x = 0; x < this._hor; x++) {
            var temp = [];
            this._tileList.push(temp);
            for (var y = 0; y < this._ver; y++) {
                temp.push(this.addTile(x, y));
            }
        }
    };
    /**
     * 添加格子
     */
    p.addTile = function (x, y, type, effect) {
        if (type === void 0) { type = null; }
        if (effect === void 0) { effect = null; }
        var tileData = new TileData();
        tileData.pos = new Vector2(x, y);
        tileData.type = type == null ? this.randomType() : type;
        tileData.effect = effect || TileEffect.NONE;
        this.creatTile(tileData);
        return tileData;
    };
    /**
     * 删除格子
     */
    p.delTile = function (x, y) {
        var duration = 300;
        var tileData = this.getTile(x, y);
        if (tileData) {
            this._tileList[x][y] = null;
            this.removeTile(tileData, duration);
            if (tileData.effect != TileEffect.NONE) {
                this.doEffect(tileData);
            }
        }
        return duration;
    };
    /**
     * 创建格子
     */
    p.creatTile = function (tileData) {
        this.applyFunc(GridCmd.TILE_CREATE, tileData);
    };
    /**
     * 移除格子
     */
    p.removeTile = function (tileData, duration) {
        this.applyFunc(GridCmd.TILE_REMOVE, tileData, duration);
    };
    /**
     * 选择格子
     */
    p.select = function (tileData) {
        this.applyFunc(GridCmd.TILE_SELECT, tileData);
    };
    /**
     * 取消选择格子
     */
    p.unselect = function (tileData) {
        this.applyFunc(GridCmd.TILE_UNSELECT, tileData);
    };
    /**
     * 转化随机格子效果
     */
    p.changeRandomTileEffect = function (effect, targetEffect) {
        var tileData = this.getRandomTile();
        while (tileData.effect != effect) {
            tileData = this.getRandomTile();
        }
        tileData.effect = targetEffect;
        this.applyFunc(GridCmd.TILE_CHANGE_EFFECT, tileData);
    };
    /**
     * 获得随机格子
     */
    p.getRandomTile = function () {
        var xRand = RandomUtils.limitInteger(0, this._hor - 1);
        var yRand = RandomUtils.limitInteger(0, this._ver - 1);
        return this._tileList[xRand][yRand];
    };
    /**
     * 移动格子
     */
    p.moveTile = function (tileData, target) {
        var duration = this.cacuMoveTime(tileData.pos, target);
        var moveInfo = new MoveInfo(tileData, target, duration);
        this.applyFunc(GridCmd.TILE_MOVE, moveInfo);
        return moveInfo;
    };
    /**
     * 移动花费的最长时间
     */
    p.getMaxMoveDuration = function (moveList) {
        var duration = 0;
        for (var i = 0; i < moveList.length; i++) {
            duration = Math.max(duration, moveList[i].duration);
        }
        return duration;
    };
    /**
     * 计算移动时间
     */
    p.cacuMoveTime = function (src, target) {
        return Math.abs(src.y - target.y) * 200;
    };
    /**
    * 更新移动后的位置
    */
    p.updateMovePosition = function (moveList) {
        var moveTileList = [];
        for (var i = 0; i < moveList.length; i++) {
            moveTileList.push(moveList[i].tileData.clone());
        }
        for (var i = 0; i < moveList.length; i++) {
            var moveInfo = moveList[i];
            moveTileList[i].pos = moveInfo.target.clone();
            this._tileList[moveInfo.target.x][moveInfo.target.y] = moveTileList[i];
        }
    };
    /**
     * 获取格子数据
     */
    p.getTile = function (x, y) {
        return this._tileList[x][y];
    };
    /**
     * 随机类型
     */
    p.randomType = function () {
        return RandomUtils.limitInteger(1, 4);
    };
    d(p, "curSelectType"
        /**
         * 当前选择类型
         */
        ,function () {
            var type = 0;
            for (var i = 0; i < this._selectArr.length; i++) {
                type = this._selectArr[i].type;
                if (type != 0) {
                    break;
                }
            }
            return type;
        }
    );
    /**
     * 设置状态
     */
    p.setState = function (state) {
        this._state = state;
    };
    /**
     * 确定状态
     */
    p.isState = function (state) {
        return this._state == state;
    };
    return GridModel;
}(BaseModel));
egret.registerClass(GridModel,'GridModel');
/**
 * 棋盘状态
 */
var GridState;
(function (GridState) {
    GridState[GridState["Start"] = 0] = "Start";
    GridState[GridState["Idle"] = 1] = "Idle";
    GridState[GridState["Select"] = 2] = "Select";
    GridState[GridState["Remove"] = 3] = "Remove";
    GridState[GridState["REPAIR"] = 4] = "REPAIR";
})(GridState || (GridState = {}));
//# sourceMappingURL=GridModel.js.map