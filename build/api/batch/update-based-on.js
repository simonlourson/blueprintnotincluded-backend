"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var db_1 = require("../db");
var blueprint_1 = require("../models/blueprint");
var batch_utils_1 = require("./batch-utils");
var UpdateBasedOn = /** @class */ (function () {
    function UpdateBasedOn() {
        console.log('Running batch UpdateBasedOn');
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // initialize database and authentification middleware
        this.db = new db_1.Database();
        setTimeout(this.updateBaseOn, 3000);
    }
    UpdateBasedOn.prototype.updateBaseOn = function () {
        blueprint_1.BlueprintModel.model.find({}).sort({ createdAt: 1 })
            .then(function (blueprints) {
            for (var indexSuspect = blueprints.length - 1; indexSuspect >= 0; indexSuspect--) {
                console.log('==> Analysing blueprint : ' + indexSuspect + ' : ' + blueprints[indexSuspect].name);
                batch_utils_1.BatchUtils.UpdateBasedOn(blueprints[indexSuspect], blueprints, indexSuspect);
            }
        });
    };
    return UpdateBasedOn;
}());
exports.UpdateBasedOn = UpdateBasedOn;
new UpdateBasedOn();
