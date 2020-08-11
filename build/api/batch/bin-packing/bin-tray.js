"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bin_line_1 = require("./bin-line");
var blueprintnotincluded_lib_1 = require("../../../../../blueprintnotincluded-lib");
var BinTray = /** @class */ (function () {
    function BinTray(binSize, trayIndex) {
        this.binSize = binSize;
        this.trayIndex = trayIndex;
        this.binLines = [];
    }
    BinTray.prototype.tryAddItem = function (id, size, bleed) {
        //console.log('Trying to add into tray ' + this.trayIndex);
        // First we try to add the item to the existing lines
        for (var _i = 0, _a = this.binLines; _i < _a.length; _i++) {
            var line = _a[_i];
            var itemAdded = line.tryAddItem(id, size, bleed, this.trayIndex);
            if (itemAdded != null)
                return itemAdded;
        }
        // If the item was not added 
        var verticalLineStart = 0;
        for (var _b = 0, _c = this.binLines; _b < _c.length; _b++) {
            var line = _c[_b];
            verticalLineStart += line.lineSize.y;
        }
        verticalLineStart = Math.ceil(verticalLineStart);
        var verticalSpaceRemaining = this.binSize.y - verticalLineStart;
        if (size.y + 2 * bleed.y > verticalSpaceRemaining) {
            //console.log('==> There is not enough vertical space remaining in this tray');
            //console.log(`==> verticalSpaceRemaining:${verticalSpaceRemaining} size.y + 2 * bleed.y:${size.y + 2 * bleed.y}`);
            return null;
        }
        else {
            //console.log(`==> Creating a new line from ${verticalLineStart} to ${verticalLineStart + size.y + 2 * bleed.y}`);
            var newLine = new bin_line_1.BinLine(verticalLineStart, new blueprintnotincluded_lib_1.Vector2(this.binSize.x, size.y + 2 * bleed.y));
            this.binLines.push(newLine);
            var itemAdded = newLine.tryAddItem(id, size, bleed, this.trayIndex);
            if (itemAdded != null)
                return itemAdded;
        }
        return null;
    };
    return BinTray;
}());
exports.BinTray = BinTray;
