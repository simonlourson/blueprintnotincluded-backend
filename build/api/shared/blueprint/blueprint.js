"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_helpers_1 = require("./blueprint-helpers");
var vector2_1 = require("../vector2");
var Blueprint = /** @class */ (function () {
    function Blueprint() {
        // Sometimes we need to pause the events (when lots of changes are happening at once)
        this.pauseChangeEvents_ = false;
        this.blueprintItems = [];
    }
    Blueprint.prototype.importFromBni = function (bniBlueprint) {
        this.blueprintItems = [];
        for (var _i = 0, _a = bniBlueprint.buildings; _i < _a.length; _i++) {
            var building = _a[_i];
            var newTemplateItem = blueprint_helpers_1.BlueprintHelpers.createInstance(building.buildingdef);
            if (newTemplateItem == null)
                continue;
            newTemplateItem.importBniBuilding(building);
            this.addBlueprintItem(newTemplateItem);
        }
    };
    Blueprint.prototype.importFromMdb = function (mdbBlueprint) {
        this.blueprintItems = [];
        for (var _i = 0, _a = mdbBlueprint.blueprintItems; _i < _a.length; _i++) {
            var originalTemplateItem = _a[_i];
            var newTemplateItem = blueprint_helpers_1.BlueprintHelpers.createInstance(originalTemplateItem.id);
            // Don't import buildings we don't recognise
            if (newTemplateItem == null)
                continue;
            newTemplateItem.importMdbBuilding(originalTemplateItem);
            this.addBlueprintItem(newTemplateItem);
        }
    };
    Blueprint.prototype.destroyAndCopyItems = function (source, emitChanges) {
        if (emitChanges === void 0) { emitChanges = true; }
        this.destroy(emitChanges);
        this.pauseChangeEvents();
        for (var _i = 0, _a = source.blueprintItems; _i < _a.length; _i++) {
            var blueprintItem = _a[_i];
            this.addBlueprintItem(blueprintItem);
        }
        this.resumeChangeEvents(emitChanges);
    };
    Blueprint.prototype.addBlueprintItem = function (blueprintItem) {
        this.blueprintItems.push(blueprintItem);
        this.emitItemAdded(blueprintItem);
    };
    Blueprint.prototype.destroyBlueprintItem = function (templateItem) {
        // Then remove from the item list, 
        var index = this.blueprintItems.indexOf(templateItem, 0);
        if (index > -1)
            this.blueprintItems.splice(index, 1);
        // Then fire the events
        this.emitItemDestroyed();
    };
    Blueprint.prototype.pauseChangeEvents = function () {
        this.pauseChangeEvents_ = true;
    };
    Blueprint.prototype.resumeChangeEvents = function (emitChanges) {
        if (emitChanges === void 0) { emitChanges = true; }
        this.pauseChangeEvents_ = false;
        if (emitChanges)
            this.emitBlueprintChanged();
    };
    Blueprint.prototype.emitItemDestroyed = function () {
        if (!this.pauseChangeEvents_) {
            this.emitBlueprintChanged();
        }
    };
    Blueprint.prototype.emitItemAdded = function (blueprintItem) {
        if (!this.pauseChangeEvents_) {
            this.emitBlueprintChanged();
        }
    };
    Blueprint.prototype.emitBlueprintChanged = function () {
    };
    Blueprint.prototype.toMdbBlueprint = function () {
        var returnValue = {
            blueprintItems: []
        };
        for (var _i = 0, _a = this.blueprintItems; _i < _a.length; _i++) {
            var originalTemplateItem = _a[_i];
            returnValue.blueprintItems.push(originalTemplateItem.toMdbBuilding());
        }
        return returnValue;
    };
    Blueprint.prototype.toBniBlueprint = function (friendlyname) {
        var returnValue = {
            friendlyname: friendlyname,
            buildings: [],
            digcommands: []
        };
        for (var _i = 0, _a = this.blueprintItems; _i < _a.length; _i++) {
            var originalTemplateItem = _a[_i];
            if (originalTemplateItem.id != 'Element')
                returnValue.buildings.push(originalTemplateItem.toBniBuilding());
        }
        return returnValue;
    };
    Blueprint.prototype.clone = function () {
        var mdb = this.toMdbBlueprint();
        var returnValue = new Blueprint();
        returnValue.importFromMdb(mdb);
        return returnValue;
    };
    Blueprint.prototype.getBoundingBox = function () {
        var topLeft = new vector2_1.Vector2(9999, 9999);
        var bottomRight = new vector2_1.Vector2(-9999, -9999);
        return [topLeft, bottomRight];
    };
    Blueprint.prototype.destroy = function (emitChanges) {
        if (emitChanges === void 0) { emitChanges = true; }
        if (this.blueprintItems != null) {
            var blueprintItemsCopy = [];
            for (var _i = 0, _a = this.blueprintItems; _i < _a.length; _i++) {
                var b = _a[_i];
                blueprintItemsCopy.push(b);
            }
            this.pauseChangeEvents();
            for (var _b = 0, blueprintItemsCopy_1 = blueprintItemsCopy; _b < blueprintItemsCopy_1.length; _b++) {
                var b = blueprintItemsCopy_1[_b];
                this.destroyBlueprintItem(b);
            }
            this.resumeChangeEvents(emitChanges);
        }
    };
    return Blueprint;
}());
exports.Blueprint = Blueprint;
