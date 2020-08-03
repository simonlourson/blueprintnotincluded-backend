"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../../../blueprintnotincluded-lib/index");
var BatchUtils = /** @class */ (function () {
    function BatchUtils() {
    }
    BatchUtils.UpdateBasedOn = function (suspect, blueprints, indexMax) {
        var suspectData = suspect.data;
        suspect.isCopy = undefined;
        suspect.copyOf = undefined;
        var isCopy = false;
        for (var indexOriginal = 0; indexOriginal < indexMax; indexOriginal++) {
            //console.log('====> Comparing with blueprint : ' + blueprints[indexOriginal].name);
            var originalData = blueprints[indexOriginal].data;
            var nbPresent = 0;
            for (var indexOriginalBuilding = 0; indexOriginalBuilding < originalData.blueprintItems.length; indexOriginalBuilding++) {
                var originalBuilding = originalData.blueprintItems[indexOriginalBuilding];
                for (var _i = 0, _a = suspectData.blueprintItems; _i < _a.length; _i++) {
                    var suspectBuilding = _a[_i];
                    if (suspectBuilding.id == originalBuilding.id && index_1.Vector2.compare(suspectBuilding.position, originalBuilding.position)) {
                        nbPresent++;
                        break;
                    }
                }
            }
            if (originalData.blueprintItems.length > 15 && nbPresent >= 0.75 * originalData.blueprintItems.length) {
                isCopy = true;
                console.log('====> Probably a copy of  : ' + indexOriginal + ' : ' + blueprints[indexOriginal].name);
                suspect.isCopy = true;
                suspect.copyOf = blueprints[indexOriginal].id;
                suspect.save()
                    .then(function () { })
                    .catch(function () { console.log('====> Save Error '); });
            }
            //console.log('====> ' + nbPresent);
            if (isCopy)
                break;
        }
    };
    BatchUtils.UpdatePositionCorrection = function (toCorrect) {
        console.log("Analysing blueprints : " + toCorrect.name);
        var toCorrectData = toCorrect.data;
        var save = false;
        for (var _i = 0, _a = toCorrectData.blueprintItems; _i < _a.length; _i++) {
            var building = _a[_i];
            if (building.position != null && building.position.x > 8000) {
                building.position.x = building.position.x - 9999;
                save = true;
            }
            if (building.position != null && building.position.y < -8000) {
                building.position.y = building.position.y + 9999;
                save = true;
            }
        }
        if (save) {
            toCorrect.data = toCorrectData;
            toCorrect.markModified('data');
            toCorrect.save()
                .then(function () {
                console.log('Save OK : ' + toCorrect.name);
            })
                .catch(function () { console.log('====> Save Error '); });
        }
    };
    return BatchUtils;
}());
exports.BatchUtils = BatchUtils;
