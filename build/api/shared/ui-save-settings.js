"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiSaveSettings = /** @class */ (function () {
    function UiSaveSettings(id) {
        this.id = id;
        this.values = [];
    }
    UiSaveSettings.prototype.importFrom = function (original) {
        for (var _i = 0, _a = original.values; _i < _a.length; _i++) {
            var value = _a[_i];
            this.values.push(value);
        }
    };
    UiSaveSettings.clone = function (original) {
        var returnValue = new UiSaveSettings(original.id);
        returnValue.importFrom(original);
        return returnValue;
    };
    return UiSaveSettings;
}());
exports.UiSaveSettings = UiSaveSettings;
