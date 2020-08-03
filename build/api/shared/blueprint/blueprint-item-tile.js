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
var BlueprintItemTile = /** @class */ (function (_super) {
    __extends(BlueprintItemTile, _super);
    function BlueprintItemTile(id) {
        return _super.call(this, id) || this;
    }
    Object.defineProperty(BlueprintItemTile.prototype, "tileConnections", {
        get: function () { return this.tileConnections_; },
        set: function (value) {
            this.tileConnections_ = value;
        },
        enumerable: true,
        configurable: true
    });
    return BlueprintItemTile;
}(blueprint_item_1.BlueprintItem));
exports.BlueprintItemTile = BlueprintItemTile;
