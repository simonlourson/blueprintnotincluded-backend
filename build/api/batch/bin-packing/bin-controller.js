"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bin_tray_1 = require("./bin-tray");
var blueprintnotincluded_lib_1 = require("../../../../../blueprintnotincluded-lib");
// This is used to repack all the textures into power of two spritesheets, so we can get mipmaps
var BinController = /** @class */ (function () {
    function BinController(binSize) {
        this.binSize = binSize;
        this.binTrays = [];
    }
    BinController.prototype.addItem = function (id, size, bleed) {
        //console.log('Trying to add this item :')
        //console.log({id: id, size: size, bleed: bleed});
        var itemAdded = null;
        var trayIndex;
        // If we know the item won't fit, we create a custom size tray
        if (size.x + 2 * bleed.x > this.binSize.x || size.y + 2 * bleed.y > this.binSize.y) {
            trayIndex = this.binTrays.length;
            //console.log(`Creating a new tray with index ${trayIndex}`);
            var newBin_1 = new bin_tray_1.BinTray(new blueprintnotincluded_lib_1.Vector2(size.x + 2 * bleed.x, size.y + 2 * bleed.y), trayIndex);
            this.binTrays.push(newBin_1);
            itemAdded = newBin_1.tryAddItem(id, size, bleed);
            if (itemAdded != null)
                return itemAdded;
        }
        // We try to add the item to the existing bins
        for (trayIndex = 0; trayIndex < this.binTrays.length; trayIndex++) {
            itemAdded = this.binTrays[trayIndex].tryAddItem(id, size, bleed);
            if (itemAdded != null)
                return itemAdded;
        }
        // If the item was not added, we create a new bin
        //console.log(`Creating a new tray with index ${trayIndex}`);
        var newBin = new bin_tray_1.BinTray(this.binSize, trayIndex);
        this.binTrays.push(newBin);
        itemAdded = newBin.tryAddItem(id, size, bleed);
        if (itemAdded != null)
            return itemAdded;
        // If the item was still not added, log it and move on
        //console.log('This should never happen');
        throw new Error('This should never happen');
    };
    return BinController;
}());
exports.BinController = BinController;
