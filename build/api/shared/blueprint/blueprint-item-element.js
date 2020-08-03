"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_item_1 = require("./blueprint-item");
var BlueprintItemElement = /** @class */ (function (_super) {
    __extends(BlueprintItemElement, _super);
    function BlueprintItemElement(id) {
        return _super.call(this, id) || this;
    }
    Object.defineProperty(BlueprintItemElement.prototype, "header", {
        get: function () { return this.buildableElements[0].name; },
        enumerable: true,
        configurable: true
    });
    BlueprintItemElement.prototype.importMdbBuilding = function (original) {
        this.mass = original.mass;
        _super.prototype.importMdbBuilding.call(this, original);
    };
    BlueprintItemElement.prototype.toMdbBuilding = function () {
        var returnValue = _super.prototype.toMdbBuilding.call(this);
        if (this.mass != BlueprintItemElement.defaultMass)
            returnValue.mass = this.mass;
        return returnValue;
    };
    BlueprintItemElement.prototype.cleanUp = function () {
        if (this.mass == null)
            this.mass = BlueprintItemElement.defaultMass;
        _super.prototype.cleanUp.call(this);
    };
    BlueprintItemElement.defaultMass = 0;
    return BlueprintItemElement;
}(blueprint_item_1.BlueprintItem));
exports.BlueprintItemElement = BlueprintItemElement;
