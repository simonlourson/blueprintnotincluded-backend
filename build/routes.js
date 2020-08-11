"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var express_jwt_1 = __importDefault(require("express-jwt"));
var login_controller_1 = require("./api/login-controller");
var register_controller_1 = require("./api/register-controller");
var duplicate_check_controller_1 = require("./api/duplicate-check-controller");
var blueprint_controller_1 = require("./api/blueprint-controller");
var Recaptcha = require('express-recaptcha').RecaptchaV3;
var Routes = /** @class */ (function () {
    function Routes() {
        this.loginController = new login_controller_1.LoginController();
        this.registerController = new register_controller_1.RegisterController();
        this.duplicateCheckController = new duplicate_check_controller_1.DuplicateCheckController();
        this.uploadBlueprintController = new blueprint_controller_1.BlueprintController();
    }
    Routes.prototype.routes = function (app) {
        // Initialize authentification middleware
        //let auth = expressJwt({secret: process.env.JWT_SECRET as string, userProperty: 'tokenPayload' });
        var auth = express_jwt_1.default({ secret: process.env.JWT_SECRET });
        var recaptcha = new Recaptcha(process.env.CAPTCHA_SITE, process.env.CAPTCHA_SECRET);
        if (process.env.ENV_NAME == 'development') {
            console.log('Initializing routes without recaptcha verification');
            app.route("/api/login").post(this.loginController.login);
            app.route("/api/register").post(this.registerController.register);
        }
        else {
            console.log('Initializing routes with recaptcha verification');
            app.route("/api/login").post(recaptcha.middleware.verify, this.loginController.login);
            app.route("/api/register").post(recaptcha.middleware.verify, this.registerController.register);
        }
        // Anonymous access
        app.route("/api/checkusername").get(this.duplicateCheckController.checkUsername);
        app.route("/api/getblueprint/:id").get(this.uploadBlueprintController.getBlueprint);
        app.route("/api/getblueprintmod/:id").get(this.uploadBlueprintController.getBlueprintMod);
        app.route("/api/getblueprintthumbnail/:id").get(this.uploadBlueprintController.getBlueprintThumbnail);
        app.route("/api/getblueprints").get(this.uploadBlueprintController.getBlueprints);
        // Logged in access
        app.route("/api/getblueprintsSecure").get(auth, this.uploadBlueprintController.getBlueprints);
        app.route("/api/uploadblueprint").post(auth, this.uploadBlueprintController.uploadBlueprint);
        app.route("/api/likeblueprint").post(auth, this.uploadBlueprintController.likeBlueprint);
        app.route("/api/deleteblueprint").post(auth, this.uploadBlueprintController.deleteBlueprint);
        app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        app.get('*', function (req, res) {
            res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
        });
    };
    return Routes;
}());
exports.Routes = Routes;
