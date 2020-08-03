"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var db_1 = require("../db");
var blueprint_1 = require("../models/blueprint");
var batch_utils_1 = require("./batch-utils");
var UpdatePositionCorrection = /** @class */ (function () {
    function UpdatePositionCorrection() {
        console.log('Running batch UpdatePositionCorrection');
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // initialize database and authentification middleware
        this.db = new db_1.Database();
        setTimeout(this.updateBaseOn, 3000);
    }
    UpdatePositionCorrection.prototype.updateBaseOn = function () {
        blueprint_1.BlueprintModel.model.find({}).sort({ createdAt: 1 })
            .then(function (blueprints) {
            for (var _i = 0, blueprints_1 = blueprints; _i < blueprints_1.length; _i++) {
                var toCorrect = blueprints_1[_i];
                batch_utils_1.BatchUtils.UpdatePositionCorrection(toCorrect);
            }
        });
    };
    return UpdatePositionCorrection;
}());
exports.UpdatePositionCorrection = UpdatePositionCorrection;
new UpdatePositionCorrection();
