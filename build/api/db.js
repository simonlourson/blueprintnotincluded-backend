"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var user_1 = require("./models/user");
var blueprint_1 = require("./models/blueprint");
var Database = /** @class */ (function () {
    function Database() {
        var _this = this;
        this.dbURI = 'mongodb://localhost:27017/blueprintnotincluded';
        mongoose_1.default.connect(this.dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).catch(function (reason) {
            console.log('Mongoose connection error: ' + reason);
        });
        ;
        mongoose_1.default.connection.on('connected', function () {
            console.log('Mongoose connected to ' + _this.dbURI);
            user_1.UserModel.init();
            blueprint_1.BlueprintModel.init();
        });
        mongoose_1.default.connection.on('error', function (err) {
            console.log('Mongoose connection error: ' + err);
        });
        mongoose_1.default.connection.on('disconnected', function () {
            console.log('Mongoose disconnected');
        });
    }
    return Database;
}());
exports.Database = Database;
