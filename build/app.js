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
var routes_1 = require("./routes");
var db_1 = require("./api/db");
var request_ip_1 = __importDefault(require("request-ip"));
var auth_1 = require("./api/auth");
var passport_1 = __importDefault(require("passport"));
var fs = __importStar(require("fs"));
var b_element_1 = require("./api/shared/database/b-element");
var oni_item_1 = require("./api/shared/database/oni-item");
require("jsdom-global/register");
var PIXI = __importStar(require("pixi.js-legacy"));
var canvas = __importStar(require("canvas"));
var App = /** @class */ (function () {
    function App() {
        this.routePrv = new routes_1.Routes();
        // Tests PIXI
        if (!window.innerWidth) {
            window.innerWidth = process.env.WINDOW_WIDTH || 800;
        }
        if (!window.innerHeight) {
            window.innerHeight = process.env.WINDOW_HEIGHT || 600;
        }
        var performance = { now: function () { return Date.now(); } };
        Object.defineProperty(window, 'performance', performance);
        global.performance = performance;
        global.requestAnimationFrame = window.requestAnimationFrame = setTimeout;
        var canvasView = canvas.createCanvas(200, 200);
        var options = {
            forceCanvas: true
        };
        var app = new PIXI.Application(options);
        // TODO color in parameter
        var graphics = new PIXI.Graphics();
        app.stage.addChild(graphics);
        // TODO color in parameter
        graphics.beginFill(0x007AD9);
        graphics.drawRect(0, 0, 300, 300);
        graphics.endFill();
        var brt = new PIXI.BaseRenderTexture({ width: 800, height: 600, scaleMode: PIXI.SCALE_MODES.LINEAR });
        var rt = new PIXI.RenderTexture(brt);
        app.renderer.render(app.stage, rt, false);
        app.renderer.plugins.extract.canvas(rt).toBlob(function (blob) {
            //app.renderer.extract.canvas(rt).toBlob((blob) => { 
            var reader = new window.FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                console.log(reader.result);
            };
        });
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Read database
        var rawdata = fs.readFileSync('database.json').toString();
        var json = JSON.parse(rawdata);
        var elements = json.elements;
        b_element_1.BuildableElement.init();
        b_element_1.BuildableElement.load(elements);
        var buildings = json.buildings;
        oni_item_1.OniItem.init();
        oni_item_1.OniItem.load(buildings);
        // initialize database and authentification middleware
        this.db = new db_1.Database();
        this.auth = new auth_1.Auth();
        // Create a new express application instance and add middleware
        this.app = express_1.default();
        this.app.use(request_ip_1.default.mw());
        this.app.use(express_1.default.json({ limit: '1mb' }));
        this.app.use(passport_1.default.initialize());
        this.routePrv.routes(this.app);
    }
    return App;
}());
exports.default = new App().app;
