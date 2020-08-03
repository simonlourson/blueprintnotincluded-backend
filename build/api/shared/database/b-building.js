"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A building (exported from the game)
var BBuilding = /** @class */ (function () {
    function BBuilding() {
    }
    return BBuilding;
}());
exports.BBuilding = BBuilding;
// All sprites for a building
// TODO since all sprites for a building are inside the same group, we don't need this class anymore. spriteNames should go directly into the BBuilding class
var BSpriteGroup = /** @class */ (function () {
    function BSpriteGroup(groupName) {
        this.groupName = groupName;
    }
    BSpriteGroup.clone = function (original) {
        var returnValue = new BSpriteGroup(original.groupName);
        returnValue.spriteNames = [];
        for (var _i = 0, _a = original.spriteNames; _i < _a.length; _i++) {
            var spriteName = _a[_i];
            returnValue.spriteNames.push(spriteName);
        }
        return returnValue;
    };
    return BSpriteGroup;
}());
exports.BSpriteGroup = BSpriteGroup;
