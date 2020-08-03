"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = require("../vector2");
var b_element_1 = require("./b-element");
var OniItem = /** @class */ (function () {
    function OniItem(id) {
        this.id = id;
        this.cleanUp();
    }
    OniItem.prototype.copyFrom = function (original) {
        this.id = original.prefabId;
        this.name = original.name;
        this.size = original.sizeInCells;
        this.isWire = original.isUtility;
        this.isBridge = original.isBridge;
        this.isTile = original.isTile;
        this.spriteModifierId = original.kanimPrefix;
        this.backColor = original.backColor;
        this.frontColor = original.frontColor;
        this.dragBuild = original.dragBuild;
        this.objectLayer = original.objectLayer;
        this.tileableLeftRight = original.tileableLeftRight;
        this.tileableTopBottom = original.tileableTopBottom;
        // TODO not sure if this is usefull still
        var imageId = original.textureName;
        this.buildableElementsArray = b_element_1.BuildableElement.getElementsFromTags(original.materialCategory);
        this.defaultElement = [];
        for (var indexElements = 0; indexElements < this.buildableElementsArray.length; indexElements++) {
            var buildableElement = this.buildableElementsArray[indexElements];
            if (buildableElement.length > 0)
                this.defaultElement[indexElements] = buildableElement[0];
            else
                this.defaultElement[indexElements] = b_element_1.BuildableElement.getElement('Unobtanium');
        }
        this.materialMass = [];
        for (var _i = 0, _a = original.materialMass; _i < _a.length; _i++) {
            var mass = _a[_i];
            this.materialMass.push(mass);
        }
        this.imageId = imageId;
    };
    OniItem.prototype.cleanUp = function () {
        if (this.isTile == null)
            this.isTile = false;
        if (this.isWire == null)
            this.isWire = false;
        if (this.isBridge == null)
            this.isBridge = false;
        if (this.isElement == null)
            this.isElement = false;
        if (this.size == null)
            this.size = new vector2_1.Vector2();
        if (this.backColor == null)
            this.backColor = 0x000000;
        if (this.frontColor == null)
            this.frontColor = 0xFFFFFF;
        if (this.buildableElementsArray == null)
            this.buildableElementsArray = [[b_element_1.BuildableElement.getElement('Vacuum')]];
        if (this.materialMass == null)
            this.materialMass = [0];
        if (this.tileableLeftRight == null)
            this.tileableLeftRight = false;
        if (this.tileableTopBottom == null)
            this.tileableTopBottom = false;
        if (this.defaultElement == null)
            this.defaultElement = [b_element_1.BuildableElement.getElement('Vacuum')];
        if (vector2_1.Vector2.Zero.equals(this.size))
            this.tileOffset = vector2_1.Vector2.Zero;
        else {
            this.tileOffset = new vector2_1.Vector2(1 - (this.size.x + (this.size.x % 2)) / 2, 0);
        }
    };
    Object.defineProperty(OniItem, "oniItems", {
        get: function () { return Array.from(OniItem.oniItemsMap.values()); },
        enumerable: true,
        configurable: true
    });
    OniItem.init = function () {
        OniItem.oniItemsMap = new Map();
    };
    OniItem.load = function (buildings) {
        for (var _i = 0, buildings_1 = buildings; _i < buildings_1.length; _i++) {
            var building = buildings_1[_i];
            var oniItem = new OniItem(building.prefabId);
            oniItem.copyFrom(building);
            oniItem.cleanUp();
            OniItem.oniItemsMap.set(oniItem.id, oniItem);
        }
        var elementOniItem = new OniItem(OniItem.elementId);
        elementOniItem.name = OniItem.elementId;
        elementOniItem.isElement = true;
        elementOniItem.cleanUp();
        OniItem.oniItemsMap.set(elementOniItem.id, elementOniItem);
    };
    OniItem.getOniItem = function (id) {
        var returnValue = OniItem.oniItemsMap.get(id);
        return returnValue;
    };
    OniItem.elementId = 'Element';
    OniItem.defaultColor = '#696969';
    return OniItem;
}());
exports.OniItem = OniItem;
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Neutral"] = 0] = "Neutral";
    Orientation[Orientation["R90"] = 1] = "R90";
    Orientation[Orientation["R180"] = 2] = "R180";
    Orientation[Orientation["R270"] = 3] = "R270";
    Orientation[Orientation["NumRotations"] = 4] = "NumRotations";
    Orientation[Orientation["FlipH"] = 5] = "FlipH";
    Orientation[Orientation["FlipV"] = 6] = "FlipV";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
