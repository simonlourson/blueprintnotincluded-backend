"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var routes_1 = require("./routes");
var db_1 = require("./api/db");
var request_ip_1 = __importDefault(require("request-ip"));
var auth_1 = require("./api/auth");
var passport_1 = __importDefault(require("passport"));
var fs = __importStar(require("fs"));
var index_1 = require("../../blueprintnotincluded-lib/index");
var App = /** @class */ (function () {
    function App() {
        this.routePrv = new routes_1.Routes();
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Read database
        var rawdata = fs.readFileSync('assets/database/database.json').toString();
        var json = JSON.parse(rawdata);
        index_1.ImageSource.init();
        var elements = json.elements;
        index_1.BuildableElement.init();
        index_1.BuildableElement.load(elements);
        var buildMenuCategories = json.buildMenuCategories;
        index_1.BuildMenuCategory.init();
        index_1.BuildMenuCategory.load(buildMenuCategories);
        var buildMenuItems = json.buildMenuItems;
        index_1.BuildMenuItem.init();
        index_1.BuildMenuItem.load(buildMenuItems);
        var uiSprites = json.uiSprites;
        index_1.SpriteInfo.init();
        index_1.SpriteInfo.load(uiSprites);
        var spriteModifiers = json.spriteModifiers;
        index_1.SpriteModifier.init();
        index_1.SpriteModifier.load(spriteModifiers);
        var buildings = json.buildings;
        index_1.OniItem.init();
        index_1.OniItem.load(buildings);
        // initialize database and authentification middleware
        this.db = new db_1.Database();
        this.auth = new auth_1.Auth();
        // Create a new express application instance and add middleware
        this.app = express_1.default();
        this.app.use(helmet_1.default.contentSecurityPolicy({
            directives: {
                "default-src": ["'self'"],
                "style-src": ["'self'", "'unsafe-inline'"],
                "frame-src": ["https://www.google.com", "http://localhost:4200"],
                "img-src": ["'self'", "data:"],
                "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.google.com", "https://www.gstatic.com"],
                "script-src-elem": ["'self'", "https://www.google.com", "https://www.gstatic.com"],
                "frame-ancestors": ["'self'", "https://oxygennotincluded.fandom.com"]
            },
        }));
        this.app.use(request_ip_1.default.mw());
        this.app.use(express_1.default.json({ limit: '1mb' }));
        this.app.use(passport_1.default.initialize());
        this.routePrv.routes(this.app);
        //PixiBackend.initTextures();
    }
    return App;
}());
exports.default = new App().app;
