"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var jsdom_1 = require("jsdom");
var FixHtmlLabels = /** @class */ (function () {
    function FixHtmlLabels() {
        console.log('Running batch FixHtmlLabels');
        this.dom = new jsdom_1.JSDOM('<!DOCTYPE html>');
        // Read database
        var databaseToFix = './assets/database/' + process.argv[2];
        console.log('Removing html tags from ' + databaseToFix);
        this.fixHtmlLabels(databaseToFix);
    }
    FixHtmlLabels.prototype.fixHtmlLabels = function (path) {
        var rawdata = fs.readFileSync(path).toString();
        var database = JSON.parse(rawdata);
        for (var _i = 0, _a = database.buildings; _i < _a.length; _i++) {
            var building = _a[_i];
            building.name = this.stripHtml(building.name);
            console.log(building.name);
            for (var _b = 0, _c = building.uiScreens; _b < _c.length; _b++) {
                var uiScreen = _c[_b];
                if (uiScreen.id == 'ActiveRangeSideScreen') {
                    var activeRangeSideScreen = uiScreen;
                    activeRangeSideScreen.activateTooltip = this.stripHtml(activeRangeSideScreen.activateTooltip);
                    activeRangeSideScreen.deactivateTooltip = this.stripHtml(activeRangeSideScreen.deactivateTooltip);
                    console.log(activeRangeSideScreen.activateTooltip);
                    console.log(activeRangeSideScreen.deactivateTooltip);
                }
                else if (uiScreen.id == 'ThresholdSwitchSideScreen') {
                    var thresholdSwitchSideScreen = uiScreen;
                    thresholdSwitchSideScreen.aboveToolTip = this.stripHtml(thresholdSwitchSideScreen.aboveToolTip);
                    thresholdSwitchSideScreen.belowToolTip = this.stripHtml(thresholdSwitchSideScreen.belowToolTip);
                    console.log(thresholdSwitchSideScreen.aboveToolTip);
                    console.log(thresholdSwitchSideScreen.belowToolTip);
                }
                else if (uiScreen.id == 'LogicBitSelectorSideScreen') {
                    var logicBitSelectorSideScreen = uiScreen;
                    logicBitSelectorSideScreen.description = this.stripHtml(logicBitSelectorSideScreen.description);
                    console.log(logicBitSelectorSideScreen.description);
                }
                else if (uiScreen.id == 'SingleSliderSideScreen') {
                    var singleSliderSideScreen = uiScreen;
                    singleSliderSideScreen.tooltip = this.stripHtml(singleSliderSideScreen.tooltip);
                    console.log(singleSliderSideScreen.tooltip);
                }
                else
                    console.log(uiScreen.id);
            }
        }
        for (var _d = 0, _e = database.elements; _d < _e.length; _d++) {
            var element = _e[_d];
            element.name = this.stripHtml(element.name);
            console.log(element.name);
        }
        var data = JSON.stringify(database, null, 2);
        fs.writeFileSync(path, data);
        console.log('done fixing labels');
    };
    FixHtmlLabels.prototype.stripHtml = function (html) {
        var tmp = this.dom.window.document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };
    return FixHtmlLabels;
}());
exports.FixHtmlLabels = FixHtmlLabels;
// npm run fixHtmlLabels -- database.json
new FixHtmlLabels();
