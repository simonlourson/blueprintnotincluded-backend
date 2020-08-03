"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_item_1 = require("./blueprint-item");
var blueprint_item_wire_1 = require("./blueprint-item-wire");
var blueprint_item_tile_1 = require("./blueprint-item-tile");
var blueprint_item_element_1 = require("./blueprint-item-element");
var oni_item_1 = require("../database/oni-item");
var BlueprintHelpers = /** @class */ (function () {
    function BlueprintHelpers() {
    }
    BlueprintHelpers.createInstance = function (id) {
        var newTemplateItem;
        var oniItem = oni_item_1.OniItem.getOniItem(id);
        if (oniItem == null)
            return undefined;
        if (oniItem.isWire)
            newTemplateItem = new blueprint_item_wire_1.BlueprintItemWire(id);
        else if (oniItem.isTile)
            newTemplateItem = new blueprint_item_tile_1.BlueprintItemTile(id);
        else if (oniItem.id == 'Element')
            newTemplateItem = new blueprint_item_element_1.BlueprintItemElement(id);
        else
            newTemplateItem = new blueprint_item_1.BlueprintItem(id);
        return newTemplateItem;
    };
    BlueprintHelpers.cloneBlueprintItem = function (original, withConnections, withOrientation) {
        if (withConnections === void 0) { withConnections = false; }
        if (withOrientation === void 0) { withOrientation = false; }
        var returnValue = BlueprintHelpers.createInstance(original.id);
        var mdbClone = original.toMdbBuilding();
        if (!withConnections)
            mdbClone.connections = undefined;
        if (!withOrientation)
            mdbClone.orientation = undefined;
        returnValue.importMdbBuilding(mdbClone);
        return returnValue;
    };
    return BlueprintHelpers;
}());
exports.BlueprintHelpers = BlueprintHelpers;
