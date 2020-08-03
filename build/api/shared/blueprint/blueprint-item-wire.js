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
var BlueprintItemWire = /** @class */ (function (_super) {
    __extends(BlueprintItemWire, _super);
    function BlueprintItemWire(id) {
        return _super.call(this, id) || this;
    }
    Object.defineProperty(BlueprintItemWire.prototype, "connections", {
        get: function () { return this.connections_; },
        set: function (value) {
            this.connections_ = value;
        },
        enumerable: true,
        configurable: true
    });
    BlueprintItemWire.prototype.importBniBuilding = function (building) {
        this.connections = building.flags;
        _super.prototype.importBniBuilding.call(this, building);
    };
    BlueprintItemWire.prototype.importMdbBuilding = function (original) {
        this.connections = original.connections;
        _super.prototype.importMdbBuilding.call(this, original);
    };
    BlueprintItemWire.prototype.cleanUp = function () {
        if (this.connections == null)
            this.connections = BlueprintItemWire.defaultConnections;
        _super.prototype.cleanUp.call(this);
    };
    BlueprintItemWire.prototype.toMdbBuilding = function () {
        var returnValue = _super.prototype.toMdbBuilding.call(this);
        if (this.connections != BlueprintItemWire.defaultConnections)
            returnValue.connections = this.connections;
        return returnValue;
    };
    BlueprintItemWire.prototype.toBniBuilding = function () {
        var returnValue = _super.prototype.toBniBuilding.call(this);
        returnValue.flags = this.connections;
        return returnValue;
    };
    BlueprintItemWire.defaultConnections = 0;
    return BlueprintItemWire;
}(blueprint_item_1.BlueprintItem));
exports.BlueprintItemWire = BlueprintItemWire;
