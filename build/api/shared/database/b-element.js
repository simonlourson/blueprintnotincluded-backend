"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Elements that buildings can be made of (Exported from the game)
// TODO we don't currently handle "exotic" elements (ie reed fibers for paintings, or bleach stone for sanitation stations)
var BuildableElement = /** @class */ (function () {
    function BuildableElement() {
    }
    BuildableElement.prototype.importFrom = function (original) {
        this.id = original.id;
        this.name = original.name;
        this.tag = original.tag;
        this.oreTags = [];
        if (original.oreTags != null)
            for (var _i = 0, _a = original.oreTags; _i < _a.length; _i++) {
                var s = _a[_i];
                this.oreTags.push(s);
            }
        this.icon = original.icon;
        this.buildMenuSort = original.buildMenuSort;
        this.color = original.color;
        this.conduitColor = original.conduitColor;
        this.uiColor = original.uiColor;
    };
    BuildableElement.prototype.hasTag = function (tag) {
        return this.oreTags.indexOf(tag) != -1;
    };
    BuildableElement.init = function () {
        BuildableElement.elements = [];
    };
    BuildableElement.load = function (originals) {
        for (var _i = 0, originals_1 = originals; _i < originals_1.length; _i++) {
            var original = originals_1[_i];
            var newElement = new BuildableElement();
            newElement.importFrom(original);
            BuildableElement.elements.push(newElement);
        }
    };
    BuildableElement.getElement = function (id) {
        for (var _i = 0, _a = BuildableElement.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.id == id)
                return element;
        }
        return new BuildableElement();
    };
    // Get a list of elements that have the parameter tag
    BuildableElement.getElementsFromTag = function (tag) {
        var returnValue = [];
        for (var _i = 0, _a = BuildableElement.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (returnValue.indexOf(element) == -1 && (element.id == tag || element.oreTags.indexOf(tag) != -1) && element.oreTags.indexOf('BuildableAny') != -1)
                returnValue.push(element);
        }
        if (returnValue.length == 0)
            returnValue.push(BuildableElement.getElement('Unobtanium'));
        returnValue = returnValue.sort(function (i1, i2) { return i1.buildMenuSort - i2.buildMenuSort; });
        return returnValue;
    };
    // Some buildings are made from more than one element (Steam Turbine)
    BuildableElement.getElementsFromTags = function (tags) {
        var returnValue = [];
        for (var indexTag = 0; indexTag < tags.length; indexTag++) {
            returnValue[indexTag] = [];
            returnValue[indexTag] = this.getElementsFromTag(tags[indexTag]);
        }
        return returnValue;
    };
    return BuildableElement;
}());
exports.BuildableElement = BuildableElement;
