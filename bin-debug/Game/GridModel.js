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
        this.repair();
    };
    /**
     * 触摸格子
     */
    p.touchTile = function (pos) {
        var tileData = this.getTile(pos.x, pos.y);
        var length = this._selectArr.length;
        if (this.isState(GridState.Idle)) {
            this._selectArr = [tileData];
            this.select(tileData, false);
            this.setState(GridState.Select);
        }
        else if (this.isState(GridState.Select) && length) {
            if (this.curSelectType == 0 || tileData.type == 0 || this.curSelectType == tileData.type) {
                var idx = this._selectArr.indexOf(tileData);
                var end = this._selectArr[length - 1];
                var cr1 = this.canRemove;
                if (idx < 0 && tileData.pos.borderUpon(end.pos)) {
                    this._selectArr.push(tileData);
                    var cr2 = this.canRemove;
                    this.connect(end, tileData, cr2);
                    this.sign();
                    if (!cr1 && cr2) {
                        for (var i = 0; i < length; i++) {
                            this.select(this._selectArr[i], true);
                        }
                    }
                }
                else if (idx == length - 2) {
                    ArrayUtils.remove(this._selectArr, end);
                    var cr2 = this.canRemove;
                    this.unselect(end);
                    this.sign();
                    if (cr1 && !cr2) {
                        for (var i = 0; i < length - 1; i++) {
                            this.select(this._selectArr[i], false);
                        }
                    }
                }
            }
        }
    };
    /**
     * 触摸结束
     */
    p.touchEnd = function () {
        if (!this.isState(GridState.Select))
            return;
        for (var i = 0; i < this._selectArr.length; i++) {
            this.unselect(this._selectArr[i]);
        }
        if (this.canRemove) {
            this.remove();
        }
        else {
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
        this._effectCntArr = [];
        this._isShake = false;
        var length = this._selectArr.length;
        var duration = 0;
        var td;
        for (var i = 0; i < length; i++) {
            var tileData = this._selectArr[i];
            if (!td && tileData.type > 0) {
                td = tileData;
            }
            var x = tileData.pos.x;
            var y = tileData.pos.y;
            var t = this.delTile(x, y, null, this.removeInterval * i);
            duration = Math.max(duration, t);
        }
        if (td) {
            var score = GameData.cacuScore(length);
            this.addScore(score, td.pos, td.type);
        }
        var pos = this._selectArr[length - 1].pos.clone();
        this.setTimeout(duration + this.interval, function () {
            _this.addEffect(length, pos);
            _this.repair();
        });
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
                if (!this.getTile(x, y)) {
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
        this.setTimeout(moveTime + this.interval, function () {
            _this.updateMovePosition(moveList);
            _this.setState(GridState.Idle);
        });
    };
    /**
     * 标记
     */
    p.sign = function () {
        this._signArr = [];
        if (this.canRemove) {
            this.getSign(this._selectArr);
        }
        this.applyFunc(GridCmd.TILE_SIGN, this._signArr);
    };
    /**
     * 获取标记列表
     */
    p.getSign = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            var posArr = this.getEffect(arr[i]);
            var f = arr[i].effect == TileEffect.RANDOM;
            for (var j = 0; j < posArr.length; j++) {
                var t = this.getTile(posArr[j].x, posArr[j].y);
                if (this._signArr.indexOf(t) < 0) {
                    this._signArr.push(t);
                    if (!f) {
                        this.getSign([t]);
                    }
                }
            }
        }
    };
    /**
     * 执行效果
     */
    p.doEffect = function (tileData, delay) {
        var _this = this;
        var effect = tileData.effect;
        var cnt = 0;
        if (this._effectCntArr[effect] == null) {
            this._effectCntArr[effect] = cnt = 1;
        }
        else {
            this._effectCntArr[effect] += 1;
            cnt = this._effectCntArr[effect];
        }
        var score = GameData.cacuEffectScore(tileData.effect, cnt);
        this.setTimeout(delay, function () {
            _this.addScore(score, tileData.pos, 0);
        });
        var duration = 0;
        var pos = tileData.pos;
        var posArr = this.getEffect(tileData);
        posArr.sort(SortUtils.random);
        var flag1 = (tileData.effect == TileEffect.BOMB || tileData.effect == TileEffect.CROSS);
        var flag2 = (tileData.effect == TileEffect.RANDOM);
        var flag3 = (tileData.effect == TileEffect.KIND);
        for (var i = 0; i < posArr.length; i++) {
            var p = posArr[i];
            var direction = void 0;
            var l = 0;
            if (flag1) {
                if (p.y > pos.y) {
                    direction = Direction.Down;
                }
                else if (p.y < pos.y) {
                    direction = Direction.Up;
                }
                else if (p.x > pos.x) {
                    direction = Direction.Right;
                }
                else {
                    direction = Direction.Left;
                }
                l = Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y)) - 1;
            }
            else if (flag2) {
                direction = Direction.Center;
                l = p.x + 1;
            }
            else if (flag3) {
                l = i + 1;
                var td = this.getTile(p.x, p.y);
                if (td) {
                    td.removeFx = TileRemoveFx.Thunder;
                }
            }
            var t = this.delTile(p.x, p.y, direction, delay + l * this.effectInterval);
            duration = Math.max(duration, t);
        }
        this.shake(tileData, delay);
        return duration;
    };
    /**
     * 震动
     */
    p.shake = function (tileData, delay) {
        var _this = this;
        var pos = tileData.pos;
        var posArr = [];
        var hor = this._hor;
        var ver = this._ver;
        var add = function (x, y) {
            var pos = new Vector2(x, y);
            for (var i = 0; i < _this._selectArr.length; i++) {
                if (_this._selectArr[i].pos.equalTo(pos)) {
                    return;
                }
            }
            for (var i = 0; i < _this._signArr.length; i++) {
                if (_this._signArr[i].pos.equalTo(pos)) {
                    return;
                }
            }
            posArr.push(pos);
        };
        if (tileData.effect == TileEffect.BOMB) {
            var minX = Math.max(0, pos.x - 3);
            var maxX = Math.min(hor, pos.x + 4);
            var minY = Math.max(0, pos.y - 3);
            var maxY = Math.min(ver, pos.y + 4);
            for (var i = minX; i < maxX; i++) {
                for (var j = minY; j < maxY; j++) {
                    add(i, j);
                }
            }
            for (var i = 0; i < posArr.length; i++) {
                var td = this.getTile(posArr[i].x, posArr[i].y);
                if (td) {
                    this.shakeTile(td, pos, delay);
                }
            }
        }
        else if (tileData.effect == TileEffect.CROSS) {
            var minX = Math.max(0, pos.x - 1);
            var maxX = Math.min(hor - 1, pos.x + 1);
            var minY = Math.max(0, pos.y - 1);
            var maxY = Math.min(ver - 1, pos.y + 1);
            for (var i = 0; i < hor; i++) {
                add(i, minY);
                add(i, maxY);
            }
            for (var i = 0; i < ver; i++) {
                add(minX, i);
                add(maxX, i);
            }
            for (var i = 0; i < posArr.length; i++) {
                var p = posArr[i];
                var td = this.getTile(p.x, p.y);
                var l = Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y));
                var a = Math.max(Math.abs(pos.x - p.x), Math.abs(pos.y - p.y));
                var sx = (pos.x - p.x) / Math.abs(pos.x - p.x) * a + p.x;
                var sy = (pos.y - p.y) / Math.abs(pos.y - p.y) * a + p.y;
                if (td) {
                    this.shakeTile(td, new Vector2(sx, sy), delay + l * this.effectInterval * 0.7);
                }
            }
        }
    };
    /**
     * 获取效果
     */
    p.getEffect = function (tileData) {
        var _this = this;
        var posArr = [];
        var add = function (x, y) {
            var pos = new Vector2(x, y);
            for (var i = 0; i < _this._selectArr.length; i++) {
                if (_this._selectArr[i].pos.equalTo(pos)) {
                    return;
                }
            }
            posArr.push(pos);
        };
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
                        add(i, j);
                    }
                }
                break;
            case TileEffect.CROSS:
                for (var i = 0; i < hor; i++) {
                    add(i, y);
                }
                for (var i = 0; i < ver; i++) {
                    add(x, i);
                }
                break;
            case TileEffect.KIND:
                var type = this.curSelectType;
                if (type == 0) {
                    if (tileData.info) {
                        type = tileData.info;
                    }
                    else {
                        type = this.randomType();
                        tileData.info = type;
                    }
                }
                for (var i = 0; i < hor; i++) {
                    for (var j = 0; j < ver; j++) {
                        var td = this.getTile(i, j);
                        if (td && td.type == type)
                            add(i, j);
                    }
                }
                break;
            case TileEffect.RANDOM:
                var arr = [];
                if (tileData.info) {
                    arr = tileData.info;
                }
                else {
                    for (var i = 0; i < hor; i++) {
                        for (var j = 0; j < ver; j++) {
                            var td = this.getTile(i, j);
                            if (td) {
                                arr.push(td);
                            }
                        }
                    }
                    arr.sort(SortUtils.random);
                    tileData.info = arr;
                }
                var l = Math.min(arr.length, 23);
                for (var i = 0; i < l; i++) {
                    add(arr[i].pos.x, arr[i].pos.y);
                }
                break;
        }
        return posArr;
    };
    /**
     * 获取得分
     */
    p.addScore = function (score, pos, type) {
        this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_SCORE, score, pos, type);
    };
    /**
     * 初始化格子列表
     */
    p.initTileList = function () {
        this._tileList = [];
        for (var x = 0; x < this._hor; x++) {
            var temp = [];
            this._tileList.push(temp);
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
    p.delTile = function (x, y, direction, delay) {
        var duration = delay + this.removeTime;
        var tileData = this.getTile(x, y);
        if (tileData) {
            this._tileList[x][y] = null;
            if (direction != null && tileData.effect == TileEffect.NONE || direction == Direction.Center) {
                this.hitTile(tileData, this.removeTime, direction, delay);
            }
            else {
                this.removeTile(tileData, this.removeTime, delay);
            }
            if (tileData.effect != TileEffect.NONE && direction != Direction.Center) {
                var t = this.doEffect(tileData, delay);
                duration = Math.max(duration, t);
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
    p.removeTile = function (tileData, duration, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.setTimeout(delay, function () {
            _this.applyFunc(GridCmd.TILE_REMOVE, tileData, duration);
        });
    };
    /**
     * 震动格子
     */
    p.shakeTile = function (tileData, src, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.setTimeout(delay, function () {
            _this.applyFunc(GridCmd.TILE_SHAKE, tileData, src);
            if (!_this._isShake) {
                _this.applyFunc(GridCmd.SHAKE);
                _this._isShake = true;
            }
        });
    };
    /**
     * 打击格子
     */
    p.hitTile = function (tileData, duration, direction, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.setTimeout(delay, function () {
            _this.applyFunc(GridCmd.TILE_HIT, tileData, duration, direction);
        });
    };
    /**
     * 连接格子
     */
    p.connect = function (src, dest, hl) {
        this.applyFunc(GridCmd.TILE_CONNECT, src, dest, hl);
    };
    /**
     * 选择格子
     */
    p.select = function (tileData, hl) {
        this.applyFunc(GridCmd.TILE_SELECT, tileData, hl);
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
        var _this = this;
        var duration = this.cacuMoveTime(tileData.pos, target);
        var moveInfo = new MoveInfo(tileData, target, duration);
        this.setTimeout(RandomUtils.limit(0, 80), function () {
            _this.applyFunc(GridCmd.TILE_MOVE, moveInfo);
        });
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
        return Math.sqrt(Math.abs(src.y - target.y)) * this.moveTime;
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
        return this._tileList && this._tileList[x] && this._tileList[x][y];
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
    d(p, "canRemove"
        /**
         * 是否可消除
         */
        ,function () {
            return this._selectArr.length >= 3;
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
    d(p, "interval"
        /**
         * 操作间隔
         */
        ,function () {
            return 50;
        }
    );
    d(p, "removeTime"
        /**
         * 移除所需时间
         */
        ,function () {
            return 300;
        }
    );
    d(p, "moveTime"
        /**
         * 移动时间
         */
        ,function () {
            return 400;
        }
    );
    d(p, "removeInterval"
        /**
         * 移除间隔
         */
        ,function () {
            return 100;
        }
    );
    d(p, "effectInterval"
        /**
         * 效果间隔
         */
        ,function () {
            return 80;
        }
    );
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