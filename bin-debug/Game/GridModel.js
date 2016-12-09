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
        this._times = 0;
        this._isFire = false;
        this.addTimes(0);
        this._selectArr = [];
        this._lastAdd = -1;
        this._connectArr = [];
        this._removeArr = [];
        this.showChests();
        this.initTileList();
        this.repair();
        this._newKey = true;
    };
    /**
     * 结束
     */
    p.over = function () {
        this.touchEnd();
        this.setState(GridState.Over);
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
                    this.setSelect();
                    if (!cr1 && cr2) {
                        for (var i = 0; i < length; i++) {
                            this.select(this._selectArr[i], true);
                        }
                    }
                }
                else if (idx < length - 1 && idx >= 0) {
                    for (var i = length - 1; i > idx; i--) {
                        this.unselect(this._selectArr[i]);
                    }
                    this._selectArr.splice(idx + 1, length - 1 - idx);
                    length = this._selectArr.length;
                    var cr2 = this.canRemove;
                    this.sign();
                    this.setSelect();
                    if (cr1 && !cr2) {
                        for (var i = 0; i <= length - 1; i++) {
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
        var length = this._selectArr.length;
        for (var i = 0; i < length; i++) {
            this.unselect(this._selectArr[i]);
        }
        if (this.canRemove) {
            this._curEffect = TileEffect.NONE;
            this._connectArr.push(length);
            this._removeArr.push(length + this._signArr.length);
            this.remove();
        }
        else {
            this.setState(GridState.Idle);
        }
        this._selectArr = [];
        this.setSelect();
    };
    /**
     * 设置选择光环
     */
    p.setSelect = function () {
        var type = 0;
        var cnt = this._selectArr.length;
        if (cnt >= 20) {
            type = 4;
        }
        else if (cnt >= 14) {
            type = 3;
        }
        else if (cnt >= 7) {
            type = 2;
        }
        else if (cnt >= 4) {
            type = 1;
        }
        var pos;
        if (cnt > 0) {
            pos = this._selectArr[cnt - 1].pos;
        }
        this.applyFunc(GridCmd.SET_SELECT, pos, type);
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
            if (!td && tileData.type > 0 && !tileData.key) {
                td = tileData;
            }
            var x = tileData.pos.x;
            var y = tileData.pos.y;
            if (this._isFire) {
                tileData.isFire = true;
                tileData.removeFx = TileRemoveFx.Bomb;
            }
            var t = this.delTile(x, y, null, this.removeInterval * i);
            duration = Math.max(duration, t);
        }
        if (td) {
            var score = GameData.cacuScore(length);
            this.addScore(0, score, td.pos, td.type);
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
        var removeCnt = this._removeArr[this._removeArr.length - 1];
        var praise = 0;
        if (removeCnt >= 35) {
            praise = 3;
        }
        else if (removeCnt >= 30) {
            praise = 2;
        }
        else if (removeCnt >= 25) {
            praise = 1;
        }
        if (praise) {
            this.showPraise(praise);
        }
        if (!this._isFire && removeCnt >= 40) {
            this.setTimeout(this.moveTime, function () { return _this.fire(); });
        }
        /** 附上钥匙、效果、时间、倍数 */
        var arr = [];
        for (var i = 0; i < removeArr.length; i++) {
            for (var j = 0; j < removeArr[i].length; j++) {
                arr.push(new Vector2(i, j));
            }
        }
        arr.sort(SortUtils.random);
        var keyPos;
        if (this._newKey) {
            this._newKey = false;
            keyPos = arr.pop();
        }
        var effectPosArr = [];
        var cc = 0;
        for (var i = this._lastAdd + 1; i < this._connectArr.length; i++) {
            cc += this._connectArr[i];
        }
        if (cc >= 15) {
            var cnt = Math.floor(cc / 15);
            for (var i = 0; i < cnt; i++) {
                effectPosArr.push(arr.pop());
            }
            this._lastAdd = this._connectArr.length - 1;
        }
        var timePos;
        if (removeCnt >= 40) {
            timePos = arr.pop();
        }
        var timesPosArr = [];
        if (this._curEffect == TileEffect.RANDOM) {
            for (var i = 0; i < 3; i++) {
                timesPosArr.push(arr.pop());
            }
        }
        else if (this._curEffect == TileEffect.KIND || removeCnt >= 20) {
            timesPosArr.push(arr.pop());
        }
        for (var x = 0; x < removeArr.length; x++) {
            var tmpArr = removeArr[x];
            tmpArr.sort(SortUtils.sortNum);
            for (var i = 0; i < tmpArr.length; i++) {
                var k = (keyPos != null) && (x == keyPos.x) && (i == keyPos.y);
                var e = null;
                for (var j = 0; j < effectPosArr.length; j++) {
                    if ((x == effectPosArr[j].x) && (i == effectPosArr[j].y)) {
                        var rand = Math.random();
                        if (rand < 0.7) {
                            e = TileEffect.BOMB;
                        }
                        else {
                            e = TileEffect.CROSS;
                        }
                    }
                }
                var t = (timePos != null) && (x == timePos.x) && (i == timePos.y);
                var ts = 0;
                for (var j = 0; j < timesPosArr.length; j++) {
                    if ((x == timesPosArr[j].x) && (i == timesPosArr[j].y)) {
                        ts = this._times + 1;
                    }
                }
                var tileData = this.addTile(x, i - tmpArr.length, null, e, k, t, ts);
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
        var effect = tileData.effect;
        if (!effect && this.checkFire(tileData)) {
            effect = TileEffect.BOMB;
        }
        var cnt = 0;
        if (this._effectCntArr[effect] == null) {
            this._effectCntArr[effect] = cnt = 1;
        }
        else {
            this._effectCntArr[effect] += 1;
            cnt = this._effectCntArr[effect];
        }
        var score = GameData.cacuEffectScore(tileData.effect, cnt);
        var duration = 0;
        var pos = tileData.pos;
        var posArr = this.getEffect(tileData);
        posArr.sort(SortUtils.random);
        var flag1 = (effect == TileEffect.BOMB || effect == TileEffect.CROSS);
        var flag2 = (effect == TileEffect.RANDOM);
        var flag3 = (effect == TileEffect.KIND);
        for (var i = 0; i < posArr.length; i++) {
            var p = posArr[i];
            var direction = void 0;
            var l = 0;
            var td = this.getTile(p.x, p.y);
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
                l = Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y));
            }
            else if (flag2) {
                direction = Direction.Center;
                l = p.x + 1;
            }
            else if (flag3) {
                l = i + 1;
                if (td) {
                    td.removeFx = TileRemoveFx.Thunder;
                }
            }
            var t = this.delTile(p.x, p.y, direction, delay + l * this.effectInterval);
            if (td && td.key) {
                score += GameData.keyScore;
            }
            else if (td && td.times) {
                score += GameData.timesScore;
            }
            duration = Math.max(duration, t);
        }
        this.shake(tileData, delay);
        if (tileData.effect) {
            this.addScore(delay, score, tileData.pos, 0);
        }
        this._curEffect = Math.max(this._curEffect, tileData.effect);
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
        var effect = tileData.effect;
        if (!effect && this.checkFire(tileData)) {
            effect = TileEffect.BOMB;
        }
        switch (effect) {
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
     * 进入爆炸模式
     */
    p.fire = function () {
        this._isFire = true;
        this.applyFunc(GameCmd.FIRE);
        this.applyControllerFunc(ControllerID.Game, GameCmd.FIRE);
    };
    /**
     * 爆炸模式结束
     */
    p.fireOver = function () {
        this._isFire = false;
        if (this.isState(GridState.Select)) {
            for (var i = 0; i < this._selectArr.length; i++) {
                this._selectArr[i].isFire = false;
                this.sign();
            }
        }
    };
    /**
     * 获取得分
     */
    p.addScore = function (delay, score, pos, type) {
        this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_SCORE, delay, score, pos, type);
    };
    /**
     * 添加时间
     */
    p.addTime = function () {
        this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_TIME);
    };
    /**
     * 添加倍率
     */
    p.addTimes = function (delay, pos, ts) {
        if (pos === void 0) { pos = null; }
        if (ts === void 0) { ts = 0; }
        this._times += 1;
        this.updateTimes();
        this.applyControllerFunc(ControllerID.Game, GameCmd.ADD_TIMES, delay, pos, ts);
    };
    /**
     * 显示称赞
     */
    p.showPraise = function (type) {
        this.applyControllerFunc(ControllerID.Game, GameCmd.SHOW_PRAISE, type);
    };
    /**
     * 显示宝箱
     */
    p.showChests = function () {
        this._ver -= 1;
        this._newKey = false;
        this._keyCount = 0;
        this.applyFunc(GridCmd.SHOW_CHESTS);
    };
    /**
     * 隐藏宝箱
     */
    p.hideChests = function () {
        this._ver += 1;
        this.applyFunc(GridCmd.HIDE_CHESTS);
    };
    /**
     * 解锁宝箱
     */
    p.unlockChest = function (pos, type) {
        var _this = this;
        this._keyCount += 1;
        this.applyFunc(GridCmd.UNLOCK_CHEST, pos, type);
        if (this._keyCount >= 5) {
            this.setTimeout(1300, function () {
                _this.applyControllerFunc(ControllerID.Game, GameCmd.SHOW_UNLOCK);
                _this.hideChests();
                _this.newRow();
            });
            return;
        }
        this._newKey = true;
    };
    /**
     * 新增一行
     */
    p.newRow = function () {
        var arr = [];
        var chanceArr = [0.65, 0.85, 0.95, 1];
        var rand = Math.random();
        var idx1 = RandomUtils.limitInteger(0, this._hor - 1);
        var idx2 = RandomUtils.limitInteger(0, this._hor - 1);
        while (idx1 == idx2) {
            idx2 = RandomUtils.limitInteger(0, this._hor - 1);
        }
        var type = this.randomType();
        if (rand < chanceArr[0]) {
            for (var i = 0; i < this._hor; i++) {
                var td = this.addTile(i, this._ver - 1, type, null, false, idx1 == i);
                this._tileList[i][this._ver - 1] = td;
                arr.push(td);
            }
        }
        else if (rand < chanceArr[1]) {
            for (var i = 0; i < this._hor; i++) {
                var effect = (idx2 == i) ? TileEffect.KIND : null;
                var td = this.addTile(i, this._ver - 1, null, effect, false, idx1 == i);
                this._tileList[i][this._ver - 1] = td;
                arr.push(td);
            }
        }
        else if (rand < chanceArr[2]) {
            for (var i = 0; i < this._hor; i++) {
                var ts = (idx2 == i) ? (this._times + 1) : 0;
                var td = this.addTile(i, this._ver - 1, type, null, false, idx1 == i, ts);
                this._tileList[i][this._ver - 1] = td;
                arr.push(td);
            }
        }
        else {
            for (var i = 0; i < this._hor; i++) {
                var effect = (idx2 == i) ? TileEffect.RANDOM : null;
                var td = this.addTile(i, this._ver - 1, type, effect, false, idx1 == i);
                this._tileList[i][this._ver - 1] = td;
                arr.push(td);
            }
        }
        this.applyFunc(GridCmd.NEW_ROW, arr);
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
    p.addTile = function (x, y, type, effect, key, time, times) {
        if (type === void 0) { type = null; }
        if (effect === void 0) { effect = null; }
        if (key === void 0) { key = false; }
        if (time === void 0) { time = false; }
        if (times === void 0) { times = 0; }
        var tileData = new TileData();
        tileData.pos = new Vector2(x, y);
        tileData.type = type == null ? this.randomType() : type;
        tileData.effect = effect || TileEffect.NONE;
        tileData.key = key;
        tileData.time = time;
        tileData.times = times;
        if (effect) {
            tileData.type = 0;
        }
        this.creatTile(tileData);
        return tileData;
    };
    /**
     * 删除格子
     */
    p.delTile = function (x, y, direction, delay) {
        var _this = this;
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
            if (tileData.key) {
                this.setTimeout(delay, function () {
                    _this.unlockChest(tileData.pos, tileData.type);
                });
                this.addScore(delay, GameData.keyScore, tileData.pos, tileData.type);
            }
            else if (tileData.time) {
                this.addTime();
            }
            else if (tileData.times > 0) {
                this.addTimes(delay, tileData.pos, tileData.times);
                this.addScore(delay, GameData.timesScore, tileData.pos, tileData.type);
            }
            if ((tileData.effect != TileEffect.NONE || this.checkFire(tileData)) && direction != Direction.Center) {
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
        dest.isFire = this._isFire;
        this.applyFunc(GridCmd.TILE_CONNECT, src, dest, hl);
    };
    /**
     * 选择格子
     */
    p.select = function (tileData, hl) {
        tileData.isFire = this._isFire;
        this.applyFunc(GridCmd.TILE_SELECT, tileData, hl);
    };
    /**
     * 取消选择格子
     */
    p.unselect = function (tileData) {
        tileData.isFire = false;
        this.applyFunc(GridCmd.TILE_UNSELECT, tileData);
    };
    /**
     * 更新倍率
     */
    p.updateTimes = function () {
        var arr = this._tileList;
        if (!arr) {
            return;
        }
        for (var x = 0; x < this._tileList.length; x++) {
            for (var y = 0; y < this._tileList.length; y++) {
                var td = this._tileList[x][y];
                if (td && td.times > 0) {
                    td.times = this._times + 1;
                    this.applyFunc(GridCmd.TILE_CHANGE_TIMES, td);
                }
            }
        }
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
     * 是否燃烧
     */
    p.checkFire = function (tileData) {
        return tileData.isFire;
    };
    /**
     * 设置状态
     */
    p.setState = function (state) {
        if (this.isState(GridState.Over))
            return;
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
            return 450;
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
    GridState[GridState["Repair"] = 4] = "Repair";
    GridState[GridState["Over"] = 5] = "Over";
})(GridState || (GridState = {}));
//# sourceMappingURL=GridModel.js.map