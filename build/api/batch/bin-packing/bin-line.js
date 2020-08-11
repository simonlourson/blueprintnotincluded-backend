"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blueprintnotincluded_lib_1 = require("../../../../../blueprintnotincluded-lib");
var BinLine = /** @class */ (function () {
    function BinLine(verticalLineStart, lineSize) {
        this.verticalLineStart = verticalLineStart;
        this.lineSize = lineSize;
        this.items = [];
    }
    BinLine.prototype.tryAddItem = function (id, size, bleed, trayIndex) {
        //console.log(`==> Trying to add to line starting at ${this.verticalLineStart}`);
        var horizontalLineStart = 0;
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            horizontalLineStart += item.totalSize.x;
        }
        horizontalLineStart = Math.ceil(horizontalLineStart);
        var horizontalSpaceRemaining = this.lineSize.x - horizontalLineStart;
        if (size.x + bleed.x * 2 > horizontalSpaceRemaining) {
            //console.log('====> There is not enough horizontal space remaining in this tray');
            //console.log(`====> horizontalSpaceRemaining:${horizontalSpaceRemaining} size.x + bleed.x * 2:${size.x + bleed.x * 2}`);
            return null;
        }
        var itemToAdd = new BinItem();
        itemToAdd.id = id;
        itemToAdd.trayIndex = trayIndex;
        itemToAdd.totalSize = new blueprintnotincluded_lib_1.Vector2(size.x + bleed.x * 2, size.y + bleed.y * 2);
        itemToAdd.uvStart = new blueprintnotincluded_lib_1.Vector2(horizontalLineStart + bleed.x, this.verticalLineStart + bleed.y);
        itemToAdd.uvSize = size;
        //console.log(`====> Creating a new item from ${horizontalLineStart} to ${horizontalLineStart + size.x + bleed.x * 2}`);
        this.items.push(itemToAdd);
        return itemToAdd;
    };
    return BinLine;
}());
exports.BinLine = BinLine;
var BinItem = /** @class */ (function () {
    function BinItem() {
    }
    return BinItem;
}());
exports.BinItem = BinItem;
