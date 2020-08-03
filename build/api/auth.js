"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var user_1 = require("./models/user");
var Auth = /** @class */ (function () {
    function Auth() {
        var localStrategy = new passport_local_1.Strategy(function (username, password, done) {
            user_1.UserModel.model.findOne({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                // Return if user not found in database
                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }
                // Return if password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Password is wrong'
                    });
                }
                // If credentials are correct, return the user object
                return done(null, user);
            });
        });
        passport_1.default.use(localStrategy);
    }
    return Auth;
}());
exports.Auth = Auth;
