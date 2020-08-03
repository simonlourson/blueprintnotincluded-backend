"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var LoginController = /** @class */ (function () {
    function LoginController() {
    }
    LoginController.prototype.login = function (req, res) {
        console.log('login' + req.clientIp);
        var reqAny = req;
        if (process.env.ENV_NAME != 'development' && (reqAny.recaptcha == null ||
            reqAny.recaptcha.error != null ||
            reqAny.recaptcha.data == null ||
            reqAny.recaptcha.data.action != 'login' ||
            !(reqAny.recaptcha.data.score > 0.5))) {
            console.log(reqAny.recaptcha);
            res.status(401).send();
        }
        else {
            passport_1.default.authenticate('local', function (err, user, info) {
                var token;
                // If Passport throws/catches an error
                if (err) {
                    res.status(404).json(err);
                    return;
                }
                // If a user is found
                if (user) {
                    token = user.generateJwt();
                    res.status(200);
                    res.json({
                        "token": token
                    });
                }
                else {
                    // If user is not found
                    res.status(401).json();
                }
            })(req, res);
        }
    };
    return LoginController;
}());
exports.LoginController = LoginController;
