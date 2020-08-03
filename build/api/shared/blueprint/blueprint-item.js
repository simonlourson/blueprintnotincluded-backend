"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = require("../vector2");
var b_element_1 = require("../database/b-element");
var oni_item_1 = require("../database/oni-item");
var BlueprintItem = /** @class */ (function () {
    function BlueprintItem(id) {
        if (id === void 0) { id = 'Vacuum'; }
        this.id = id;
        this.oniItem = oni_item_1.OniItem.getOniItem(this.id);
    }
    Object.defineProperty(BlueprintItem.prototype, "temperatureCelcius", {
        get: function () { return this.temperature - 273.15; },
        set: function (value) { this.temperature = value + 273.15; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlueprintItem.prototype, "header", {
        get: function () { return this.oniItem.name; },
        enumerable: true,
        configurable: true
    });
    BlueprintItem.prototype.setElement = function (elementId, index) {
        if (this.buildableElements == null)
            this.buildableElements = [];
        this.buildableElements[index] = b_element_1.BuildableElement.getElement(elementId);
    };
    BlueprintItem.prototype.getName = function () {
        return this.id;
    };
    BlueprintItem.prototype.importBniBuilding = function (building) {
        if (building.offset != null)
            this.position = new vector2_1.Vector2(building.offset.x == null ? 0 : building.offset.x, building.offset.y == null ? 0 : building.offset.y);
        else
            this.position = vector2_1.Vector2.zero();
        this.changeOrientation(building.orientation);
        this.cleanUp();
        this.prepareBoundingBox();
    };
    BlueprintItem.prototype.importMdbBuilding = function (original) {
        this.position = vector2_1.Vector2.clone(original.position);
        if (original.elements != null && original.elements.length > 0)
            for (var indexElement = 0; indexElement < original.elements.length; indexElement++)
                if (original.elements[indexElement] != null)
                    this.setElement(original.elements[indexElement], indexElement);
                else
                    this.setElement(this.oniItem.defaultElement[indexElement].id, indexElement);
        // TODO default temperature
        this.temperature = original.temperature;
        this.changeOrientation(original.orientation);
        this.cleanUp();
        this.prepareBoundingBox();
    };
    BlueprintItem.prototype.updateRotationScale = function () {
        switch (this.orientation) {
            case oni_item_1.Orientation.R90:
                this.rotation = 90;
                this.scale = vector2_1.Vector2.One;
                break;
            case oni_item_1.Orientation.R180:
                this.rotation = 180;
                this.scale = vector2_1.Vector2.One;
                break;
            case oni_item_1.Orientation.R270:
                this.rotation = 270;
                this.scale = vector2_1.Vector2.One;
                break;
            case oni_item_1.Orientation.FlipH:
                this.rotation = 0;
                this.scale = new vector2_1.Vector2(-1, 1);
                break;
            case oni_item_1.Orientation.FlipV:
                this.rotation = 0;
                this.scale = new vector2_1.Vector2(1, -1);
                break;
            case oni_item_1.Orientation.Neutral:
            default:
                this.rotation = 0;
                this.scale = vector2_1.Vector2.One;
                break;
        }
        this.prepareBoundingBox();
    };
    BlueprintItem.prototype.nextOrientation = function () {
        var indexCurrentOrientation = this.oniItem.orientations.indexOf(this.orientation);
        indexCurrentOrientation = (indexCurrentOrientation + 1) % this.oniItem.orientations.length;
        this.changeOrientation(this.oniItem.orientations[indexCurrentOrientation]);
    };
    BlueprintItem.prototype.changeOrientation = function (newOrientation) {
        this.orientation = newOrientation;
        this.updateRotationScale();
    };
    BlueprintItem.prototype.cleanUp = function () {
        if (this.rotation == null)
            this.rotation = BlueprintItem.defaultRotation;
        if (this.scale == null)
            this.scale = BlueprintItem.defaultScale;
        if (this.temperature == null)
            this.temperature = BlueprintItem.defaultTemperature;
        if (this.buildableElements == null)
            this.buildableElements = [];
        for (var indexElement = 0; indexElement < this.oniItem.buildableElementsArray.length; indexElement++)
            if (this.buildableElements[indexElement] == null)
                this.setElement(this.oniItem.defaultElement[indexElement].id, indexElement);
        if (this.orientation == null)
            this.changeOrientation(oni_item_1.Orientation.Neutral);
    };
    BlueprintItem.prototype.toMdbBuilding = function () {
        var returnValue = {
            id: this.id
        };
        returnValue.position = vector2_1.Vector2.clone(this.position);
        if (this.temperature != BlueprintItem.defaultTemperature)
            returnValue.temperature = this.temperature;
        var elements = [];
        var exportElements = false;
        for (var indexElement = 0; indexElement < this.buildableElements.length; indexElement++)
            if (this.buildableElements[indexElement] != this.oniItem.defaultElement[indexElement]) {
                elements[indexElement] = this.buildableElements[indexElement].id;
                exportElements = true;
            }
        if (exportElements)
            returnValue.elements = elements;
        if (this.orientation != oni_item_1.Orientation.Neutral)
            returnValue.orientation = this.orientation;
        return returnValue;
    };
    BlueprintItem.prototype.toBniBuilding = function () {
        var returnValue = {
            buildingdef: this.id,
            flags: 0,
            offset: new vector2_1.Vector2(this.position.x, this.position.y),
            orientation: this.orientation,
            selected_elements: this.getSelectedElementsTag()
        };
        return returnValue;
    };
    BlueprintItem.prototype.getSelectedElementsTag = function () {
        var returnValue = [];
        for (var _i = 0, _a = this.buildableElements; _i < _a.length; _i++) {
            var element = _a[_i];
            returnValue.push(element.tag);
        }
        return returnValue;
    };
    BlueprintItem.prototype.prepareBoundingBox = function () {
        var realSize = this.oniItem.size;
        if (vector2_1.Vector2.Zero.equals(realSize))
            realSize = vector2_1.Vector2.One;
        var originalTopLeft = new vector2_1.Vector2(this.position.x + this.oniItem.tileOffset.x, this.position.y + this.oniItem.tileOffset.y + realSize.y - 1);
        var orignialBottomRight = new vector2_1.Vector2(originalTopLeft.x + realSize.x - 1, originalTopLeft.y - realSize.y + 1);
    };
    BlueprintItem.defaultRotation = 0;
    BlueprintItem.defaultScale = vector2_1.Vector2.One;
    BlueprintItem.defaultTemperature = 30 + 273.15;
    return BlueprintItem;
}());
exports.BlueprintItem = BlueprintItem;
