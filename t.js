/**
 * GobangForward v1.1
 * Developed by ±Ï·É(Bi Fei) From China
 * Copyright @ http://www.wushen.biz
 * Please reserve the declaration of copyright when using this document
 * A simple run of these functions is at http://www.wushen.biz/wispeeder
 * To update this document, please visit at http://www.wushen.biz/programs/?id=20110505195043
 */
var GobangForward = function(array, level, center, side) {
    this.level = level || 0;
    this.center = center || [9, 9];
    this.side = side || 19;
    this.array = array;
    this.blackArray = [];
    this.whiteArray = [];
    this.result = [];
    this.patterns = [];
    this.step = 1;
    this.farthest = 0;
    this.initResult()
};
GobangForward.initTwoDimensionalArray = function(array, range) {
    for (var i = 0; i <= range; i++) array[i] = []
};
GobangForward.push = function(array, data) {
    var flag = true;
    for (var i = 0,
    len = array.length; i < len; i++) {
        if (array[i] instanceof Array && array[i].join() == data.join()) {
            flag = false;
            break
        }
    };
    if (flag) array.push(data)
};
GobangForward.prototype = {
    layout: function(step) {
        var posible = [];
        posible.push([this.whiteArray[step][0] - 1, this.whiteArray[step][1] - 1]);
        posible.push([this.whiteArray[step][0] + 1, this.whiteArray[step][1] - 1]);
        posible.push([this.whiteArray[step][0] - 1, this.whiteArray[step][1] + 1]);
        posible.push([this.whiteArray[step][0] + 1, this.whiteArray[step][1] + 1]);
        return this.bestLayout(posible)
    },
    bestLayout: function(array) {
        var result = this.random(array);
        if (result && this.forward(result[0], result[1], 1).toString().match("3")) {
            for (var i = 0,
            len = array.length; i < len; i++) {
                if (array[i] == result) array.splice(i, 1)
            };
            result = this.bestLayout(array)
        };
        return result
    },
    initResult: function() {
        this.result = [];
        GobangForward.initTwoDimensionalArray(this.result, 1);
        this.patterns = [];
        GobangForward.initTwoDimensionalArray(this.patterns, 3);
        return this
    },
    pushPatterns: function(index, direction) {
        var flag = true;
        for (var i = 0,
        len = this.patterns[index].length; i < len; i++) {
            if (this.patterns[index][i] == direction) {
                flag = false;
                break
            }
        };
        if (flag) this.patterns[index].push(direction);
        return this
    },
    isBlank: function(x, y) {
        return this.array[x][y] == undefined
    },
    random: function(array) {
        var result = null;
        if (array.length) {
            var range = parseInt(Math.random() * array.length);
            if (this.isBlank(array[range][0], array[range][1])) result = array[range];
            else {
                array.splice(range, 1);
                result = this.random(array)
            }
        };
        return result
    },
    updateFarthest: function(x, y) {
        var radiusX = Math.abs(9 - x);
        var radiusY = Math.abs(9 - y);
        this.farthest = radiusX > this.farthest ? radiusX: radiusY > this.farthest ? radiusY: this.farthest;
        return this
    },
    forward: function(x, y, turn) {
        var result = null;
        if (this.isBlank(x, y)) {
            this.array[x][y] = turn;
            result = this.matchChess(x, y, turn);
            this.array[x][y] = undefined
        };
        return result
    },
    getLevel: function(array, turn, level) {
        var result = [];
        this.initResult();
        for (var i = 0,
        len1 = array.length; i < len1; i++) {
            this.matchChess(array[i][0], array[i][1], turn);
            var elements = this.result[level];
            if (elements) {
                for (var j = 0,
                len2 = elements.length; j < len2; j++) GobangForward.push(result, elements[j])
            }
        };
        return result.length ? this.getBest(result, turn) : null
    },
    getBest: function(array, turn) {
        var result = array;
        if (array.length == 1 && this.isBlank(array[0][0], array[0][1])) result = array[0];
        if (array.length > 1) {
            result = this.getWin(result, turn) || result;
            result = this.getDoublePatterns(result, turn) || result;
            result = this.getDefense(result) || result;
            result = this.getAttack(result, turn) || result;
            result = this.getNumber(result, turn) || result;
            result = this.getDistance(result)
        };
        return result
    },
    getWin: function(array, turn) {
        var result = [];
        if (array != null) {
            for (var i = 0,
            len1 = array.length; i < len1; i++) {
                var temp = this.forward(array[i][0], array[i][1], turn);
                for (var j = 0,
                len2 = temp.length; j < len2; j++) {
                    if (temp[j] == 4 || temp[j] >= 5) result.push(array[i])
                }
            }
        };
        return result.length ? result: null
    },
    getDoublePatterns: function(array, turn) {
        var result = [];
        if (array != null) {
            for (var i = 0,
            len1 = array.length; i < len1; i++) {
                var count = 0;
                this.initResult().forward(array[i][0], array[i][1], turn);
                for (var j = 0,
                len2 = this.patterns.length; j < len2; j++) count += this.patterns[j].length;
                if (count >= 2) result.push(array[i])
            }
        };
        return result.length ? result: null
    },
    getDefense: function(array) {
        var result = [];
        if (array != null) {
            for (var i = 0,
            len1 = array.length; i < len1; i++) {
                this.initResult().forward(array[i][0], array[i][1], 0);
                for (var j = 0,
                len2 = this.patterns.length; j < len2; j++) {
                    if (this.patterns[j].length) {
                        result.push(array[i]);
                        break
                    }
                }
            }
        };
        return this.getDoublePatterns(result, 0)
    },
    getAttack: function(array, turn) {
        var result = [];
        if (array != null) {
            for (var i = 0,
            len1 = array.length; i < len1; i++) {
                this.initResult().forward(array[i][0], array[i][1], 1);
                for (var j = 0,
                len2 = this.patterns.length; j < len2; j++) {
                    if (this.patterns[j].length) {
                        result.push(array[i]);
                        break
                    }
                }
            }
        };
        return result.length ? result: null
    },
    getNumber: function(array, turn) {
        var result = [];
        if (array != null) {
            var total = 0;
            for (var i = 0,
            len1 = array.length; i < len1; i++) {
                var temp = this.forward(array[i][0], array[i][1], turn);
                var count = 0;
                for (var j = 0,
                len2 = temp.length; j < len2; j++) {
                    if (j == array[i][2]) continue;
                    count += temp[j]
                };
                if (count > total) {
                    result = [];
                    total = count;
                    GobangForward.push(result, array[i])
                };
                if (count == total) GobangForward.push(result, array[i])
            }
        };
        return result.length ? result: null
    },
    getDistance: function(array) {
        var result = [];
        if (array != null) {
            var len = array.length;
            var min = this.side;
            for (var i = 0; i < len; i++) {
                var distance = Math.abs(array[i][0] - this.center[0]) + Math.abs(array[i][1] - this.center[1]);
                if (distance < min) min = distance
            };
            for (var i = 0; i < len; i++) {
                var distance = Math.abs(array[i][0] - this.center[0]) + Math.abs(array[i][1] - this.center[1]);
                if (distance == min) result.push(array[i])
            }
        };
        return this.random(result)
    },
    getBlank: function(turn, isBest) {
        var result = null;
        var level = [];
        GobangForward.initTwoDimensionalArray(level, 2);
        var index;
        outer: for (var i = 1; i <= this.center[0]; i++) {
            if (i > this.farthest) break;
            index = [this.center[0] - i, this.center[1]];
            var counter = 0;
            var step = [i, i * 2, i * 2, i * 2, i - 1];
            var route = [function() {
                index[1]--
            },
            function() {
                index[0]++
            },
            function() {
                index[1]++
            },
            function() {
                index[0]--
            },
            function() {
                index[1]--
            }];
            for (var j = 0,
            len1 = i * 8; j < len1; j++) {
                if (index[0] >= 0 && index[0] < this.side && index[1] >= 0 && index[1] < this.side && this.isBlank(index[0], index[1])) {
                    var temp = this.initResult().forward(index[0], index[1], turn);
                    for (var k = 0,
                    len2 = this.result.length; k < len2; k++) {
                        if (this.result[k].length) level[k].push([index[0], index[1], k])
                    };
                    if (temp.join() != "1,1,1,1" && turn == 1) {
                        for (var k = 0,
                        len2 = temp.length; k < len2; k++) {
                            if (temp[k] == 3.1 || temp[k] == 2) level[2].push([index[0], index[1], k])
                        }
                    }
                };
                if (counter == step[0]) {
                    counter = 0;
                    step.shift();
                    route.shift()
                };
                if (counter < step[0]) {
                    counter++;
                    route[0]()
                }
            }
        };
        for (var i = 0,
        len = level.length; i < len; i++) {
            if (level[i].length) {
                if (isBest) {
                    var temp = this.getDoublePatterns(level[i], turn);
                    if (temp) {
                        result = this.getBest(temp, turn);
                        break
                    }
                } else {
                    result = this.getBest(level[i], turn);
                    break
                }
            }
        };
        return result
    },
    finish: function() {
        return this.getLevel(this.whiteArray, 1, 0)
    },
    prevention: function() {
        return this.getLevel(this.blackArray, 0, 0)
    },
    rush: function() {
        return this.getLevel(this.whiteArray, 1, 1)
    },
    defend: function() {
        return this.getLevel(this.blackArray, 0, 1)
    },
    depend: function() {
        if (this.level == 0) return null;
        else if (this.level == 1) return this.getBlank(0, false);
        else return this.getBlank(0, true)
    },
    attack: function() {
        return this.getBlank(1, false)
    },
    setLevel: function(level) {
        this.level = level;
        return this
    },
    setCenter: function(center) {
        this.center = center;
        return this
    },
    setSide: function(side) {
        this.side = side;
        return this
    },
    back: function() {
        this.step--;
        this.blackArray.pop();
        this.whiteArray.pop();
        return this
    },
    reset: function() {
        this.blackArray = [];
        this.whiteArray = [];
        this.step = 1;
        this.farthest = 0;
        return this
    },
    getStep: function(x, y) {
        var result = null;
        if (x == undefined || y == undefined) this.step = 0;
        else {
            this.blackArray.push([x, y]);
            this.updateFarthest(x, y)
        };
        switch (this.step) {
        case 0:
            result = this.center;
            this.step++;
            break;
        case 1:
            if (this.isBlank(this.center[0], this.center[1])) result = this.center;
            else result = this.random([[this.center[0] - 1, this.center[1]], [this.center[0] + 1, this.center[1]]]);
            break;
        case 2:
            result = this.layout(0);
            break;
        case 3:
            result = this.defend() || this.layout(0) || this.layout(1);
            break;
        default:
            while (!result) {
                result = this.finish() || this.prevention() || this.rush() || this.defend() || this.depend() || this.attack();
                this.farthest++
            };
            result = result.splice(0, 2);
        };
        this.step++;
        this.whiteArray.push(result);
        this.updateFarthest(result[0], result[1]);
        return result
    },
    matchChess: function(x, y, turn) {
        var isAttack = turn == 1;
        var allOfChess = [];
        var funcName, condition, pointerX, pointerY;
        var that = this;
        function a() {
            funcName = [function() {--pointerX
            },
            function() {++pointerX
            }];
            condition = "pointerX > -1 && pointerX < that.side";
            e(0)
        };
        function b() {
            funcName = [function() {--pointerY
            },
            function() {++pointerY
            }];
            condition = "pointerY > -1 && pointerY < that.side";
            e(1)
        };
        function c() {
            funcName = [function() {--pointerX; --pointerY
            },
            function() {++pointerX; ++pointerY
            }];
            condition = "pointerX > -1 && pointerX < that.side && pointerY > -1 && pointerY < that.side";
            e(2)
        };
        function d() {
            funcName = [function() {--pointerX; ++pointerY
            },
            function() {++pointerX; --pointerY
            }];
            e(3)
        };
        function e(index) {
            var chess, another, unique, skip, sides;
            for (var i = 0; i < 2; i++) {
                pointerX = x;
                pointerY = y;
                chess = another = 0;
                unique = skip = null;
                sides = [];
                g(funcName[i], funcName[1 - i]);
                f(index, chess, another, unique, sides, skip)
            };
            allOfChess[index] = chess;
            function g(go, back) {
                var hasUndefined = false;
                var points = [];
                var values = [];
                while (back(), eval(condition)) {
                    if (that.array[pointerX][pointerY] == 1 - turn) {
                        chess += 0.1;
                        break
                    };
                    if (that.array[pointerX][pointerY] == undefined) {
                        sides.push([pointerX, pointerY]);
                        break
                    }
                }
                while (go(), eval(condition)) {
                    points.push([pointerX, pointerY]);
                    var value = that.array[pointerX][pointerY];
                    if (value == undefined) value = -1;
                    values.push(value);
                    if (that.array[pointerX][pointerY] == turn) hasUndefined ? another++:chess++;
                    if (that.array[pointerX][pointerY] == 1 - turn) {
                        hasUndefined ? another += 0.1 : chess += 0.1;
                        break
                    };
                    if (that.array[pointerX][pointerY] == undefined) {
                        if (hasUndefined) break;
                        hasUndefined = true
                    }
                };
                h(points, values)
            };
            function h(points, values) {
                var len = values.length - 1;
                if (values[len] == -1 && values[len - 1] == -1) {
                    sides.push(points[len - 1]);
                    skip = points[len]
                };
                if (values[len] == -1 && values[len - 1] != -1) sides.push(points[len]);
                var query = values.join();
                if (query.indexOf(turn + ",-1," + turn) != -1) {
                    for (var i = 0; i < len; i++) {
                        if (values[i] == -1) unique = points[i]
                    }
                }
            }
        };
        function f(index, chess, another, unique, sides, skip) {
            if (chess >= 3 && another > 0 || chess > 0 && another >= 3 || chess >= 2 && parseInt(another) > 1) {
                if (unique && that.isBlank(unique[0], unique[1])) {
                    GobangForward.push(that.result[0], [unique[0], unique[1], index]);
                    that.pushPatterns(0, index)
                }
            };
            if (chess >= 4) {
                for (var i = 0; i < 2; i++) {
                    if (sides[i] && that.isBlank(sides[i][0], sides[i][1])) {
                        GobangForward.push(that.result[0], [sides[i][0], sides[i][1], index]);
                        that.pushPatterns(1, index)
                    }
                }
            };
            if (chess == 3 && parseInt(another) == 0) {
                for (var i = 0; i < 2; i++) {
                    if (sides[i] && that.isBlank(sides[i][0], sides[i][1])) {
                        GobangForward.push(that.result[1], [sides[i][0], sides[i][1], index]);
                        that.pushPatterns(2, index)
                    }
                };
                if (isAttack && skip && that.isBlank(skip[0], skip[1])) {
                    GobangForward.push(that.result[1], [skip[0], skip[1], index]);
                    that.pushPatterns(2, index)
                }
            };
            if (chess == 2 && another == 1 || chess == 1 && another == 2) {
                if (isAttack) {
                    if (unique && that.isBlank(unique[0], unique[1])) {
                        GobangForward.push(that.result[1], [unique[0], unique[1], index]);
                        that.pushPatterns(3, index)
                    }
                } else {
                    if (unique && that.isBlank(unique[0], unique[1])) {
                        GobangForward.push(that.result[1], [unique[0], unique[1], index]);
                        that.pushPatterns(3, index)
                    };
                    for (var i = 0; i < 2; i++) {
                        if (sides[i] && that.isBlank(sides[i][0], sides[i][1])) {
                            GobangForward.push(that.result[1], [sides[i][0], sides[i][1], index]);
                            that.pushPatterns(3, index)
                        }
                    }
                }
            }
        };
        a();
        b();
        c();
        d();
        return [allOfChess[0], allOfChess[1], allOfChess[2], allOfChess[3]]
    }
};
