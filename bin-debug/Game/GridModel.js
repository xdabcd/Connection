/**
 *
 * 棋盘
 *
 */
var GridModel = (function (_super) {
    __extends(GridModel, _super);
    function GridModel() {
        _super.apply(this, arguments);
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
            if (tileData.type == this._selectArr[0].type) {
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
        for (var i = 0; i < this._selectArr.length; i++) {
            var tileData = this._selectArr[i];
            var x = tileData.pos.x;
            var y = tileData.pos.y;
            removeTime = this.delTile(x, y);
        }
        TimerManager.doTimer(removeTime, 1, function () {
            _this.repair();
        }, this);
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
        TimerManager.doTimer(moveTime, 1, function () {
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
    p.addTile = function (x, y) {
        var tileData = new TileData();
        tileData.pos = new Vector2(x, y);
        tileData.type = this.randomType();
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