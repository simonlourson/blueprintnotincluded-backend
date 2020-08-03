"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./models/user");
var mongoose_1 = __importDefault(require("mongoose"));
var RegisterController = /** @class */ (function () {
    function RegisterController() {
    }
    RegisterController.prototype.register = function (req, res) {
        var reqAny = req;
        if (process.env.ENV_NAME != 'development' && (reqAny.recaptcha == null ||
            reqAny.recaptcha.error != null ||
            reqAny.recaptcha.data == null ||
            reqAny.recaptcha.data.action != 'register' ||
            !(reqAny.recaptcha.data.score > 0.5))) {
            console.log(reqAny.recaptcha);
            res.status(401).send();
        }
        else {
            console.log('Received registration from ' + req.clientIp);
            if (mongoose_1.default.connection.readyState == 0) {
                console.log('MongoDb is not ready');
                res.status(503).json({ registrationResult: 'DB_ERROR' });
            }
            var user_2 = new user_1.UserModel.model();
            var username = req.body.username;
            var regexp = /^[a-zA-Z0-9-_]+$/;
            if (username.search(regexp) == -1 || username.lenght > 30) {
                console.log('Username too long or with weird characters');
                res.status(500).json({ registrationResult: 'ERROR' });
                return;
            }
            // TODO sanitation and check null here
            user_2.email = req.body.email;
            user_2.username = req.body.username;
            user_2.setPassword(req.body.password);
            user_2.save()
                .then(function () {
                console.log('Registration succesful');
                res.json({ token: user_2.generateJwt() });
            })
                .catch(function (error) {
                console.log('Registration error');
                console.log(error);
                if (error.code == 11000)
                    res.json({ duplicateError: true });
                else
                    res.status(500).json({ registrationResult: 'ERROR' });
            });
        }
    };
    return RegisterController;
}());
exports.RegisterController = RegisterController;
