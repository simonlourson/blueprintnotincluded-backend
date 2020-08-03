"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var crypto_js_1 = __importDefault(require("crypto-js"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var UserModel = /** @class */ (function () {
    function UserModel() {
    }
    UserModel.init = function () {
        var userSchema = new mongoose_1.default.Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            username: {
                type: String,
                unique: true,
                required: true
            },
            hash: String,
            salt: String
        });
        userSchema.methods.setPassword = function (password) {
            this.salt = crypto_js_1.default.lib.WordArray.random(16);
            this.hash = crypto_js_1.default.PBKDF2(password, this.salt, { keySize: 512 / 32 }).toString(crypto_js_1.default.enc.Hex);
        };
        userSchema.methods.validPassword = function (password) {
            var hash = crypto_js_1.default.PBKDF2(password, this.salt, { keySize: 512 / 32 }).toString(crypto_js_1.default.enc.Hex);
            return this.hash === hash;
        };
        userSchema.methods.generateJwt = function () {
            var expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            var userJwt = {
                _id: this._id,
                email: this.email,
                username: this.username,
                exp: expiry.getTime() / 1000
            };
            return jsonwebtoken_1.default.sign(userJwt, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
        };
        UserModel.model = mongoose_1.default.model('User', userSchema);
    };
    UserModel.isUser = function (obj) {
        return (obj && obj.username && typeof obj.username === 'string');
    };
    return UserModel;
}());
exports.UserModel = UserModel;
