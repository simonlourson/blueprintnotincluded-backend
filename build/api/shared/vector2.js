"use strict";
// SHARED CODE
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.equals = function (v) {
        if (v == null)
            return false;
        return this.x == v.x && this.y == v.y;
    };
    Vector2.compare = function (v1, v2) {
        if (v1 == null && v2 == null)
            return true;
        else if (v1 == null || v2 == null)
            return false;
        else {
            return v1.x == v2.x && v1.y == v2.y;
        }
    };
    Vector2.prototype.copyFrom = function (original) {
        if (original != null && original.x != null)
            this.x = original.x;
        if (original != null && original.y != null)
            this.y = original.y;
    };
    Vector2.prototype.clone = function () {
        var returnValue = new Vector2();
        returnValue.copyFrom(this);
        return returnValue;
    };
    Object.defineProperty(Vector2.prototype, "length", {
        get: function () {
            return Math.sqrt(this.lengthSquared);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "lengthSquared", {
        get: function () {
            return this.x * this.x + this.y * this.y;
        },
        enumerable: true,
        configurable: true
    });
    Vector2.clone = function (original) {
        if (original == null)
            throw Error('Vector2.clone : original cannot be null');
        var returnValue = new Vector2();
        returnValue.copyFrom(original);
        return returnValue;
    };
    Vector2.zero = function () { return Vector2.clone(Vector2.Zero); };
    Vector2.Zero = new Vector2();
    Vector2.One = new Vector2(1, 1);
    Vector2.Left = new Vector2(-1, 0);
    Vector2.Right = new Vector2(1, 0);
    Vector2.Up = new Vector2(0, 1);
    Vector2.Down = new Vector2(0, -1);
    return Vector2;
}());
exports.Vector2 = Vector2;
