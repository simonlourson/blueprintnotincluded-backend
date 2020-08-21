"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var fs = __importStar(require("fs"));
var jimp = __importStar(require("jimp"));
var index_1 = require("../../../../blueprintnotincluded-lib/index");
var blueprintnotincluded_lib_1 = require("../../../../blueprintnotincluded-lib");
var pixi_node_util_1 = require("../pixi-node-util");
var GenerateWhite = /** @class */ (function () {
    function GenerateWhite() {
        console.log('Running batch GenerateWhite');
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Read database
        var rawdata = fs.readFileSync('./assets/database/database-groups.json').toString();
        var json = JSON.parse(rawdata);
        blueprintnotincluded_lib_1.ImageSource.init();
        var elements = json.elements;
        blueprintnotincluded_lib_1.BuildableElement.init();
        blueprintnotincluded_lib_1.BuildableElement.load(elements);
        var buildMenuCategories = json.buildMenuCategories;
        blueprintnotincluded_lib_1.BuildMenuCategory.init();
        blueprintnotincluded_lib_1.BuildMenuCategory.load(buildMenuCategories);
        var buildMenuItems = json.buildMenuItems;
        blueprintnotincluded_lib_1.BuildMenuItem.init();
        blueprintnotincluded_lib_1.BuildMenuItem.load(buildMenuItems);
        var uiSprites = json.uiSprites;
        blueprintnotincluded_lib_1.SpriteInfo.init();
        blueprintnotincluded_lib_1.SpriteInfo.load(uiSprites);
        var spriteModifiers = json.spriteModifiers;
        blueprintnotincluded_lib_1.SpriteModifier.init();
        blueprintnotincluded_lib_1.SpriteModifier.load(spriteModifiers);
        var buildings = json.buildings;
        blueprintnotincluded_lib_1.OniItem.init();
        blueprintnotincluded_lib_1.OniItem.load(buildings);
        this.generateWhite(json);
    }
    GenerateWhite.prototype.generateWhite = function (database) {
        return __awaiter(this, void 0, void 0, function () {
            var pixiNodeUtil, sourceSpriteModifiers, sourceTextures, _loop_1, _i, sourceSpriteModifiers_1, sourceSpriteModifier, _a, sourceTextures_1, sourceTexture, imageUrl, brt_1, baseTexture, texture, brt, rt, sprite, base64, white, whitePath, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pixiNodeUtil = new pixi_node_util_1.PixiNodeUtil({ forceCanvas: true, preserveDrawingBuffer: true });
                        sourceSpriteModifiers = database.spriteModifiers.filter(function (s) { return s.tags.indexOf(index_1.SpriteTag.solid) != -1; });
                        sourceTextures = [];
                        _loop_1 = function (sourceSpriteModifier) {
                            var sourceSpriteInfo = database.uiSprites.find(function (s) { return s.name == sourceSpriteModifier.spriteInfoName; });
                            if (sourceSpriteInfo == undefined)
                                throw new Error('GenerateWhite.generateWhite : spriteInfoName not found : ' + sourceSpriteModifier.spriteInfoName);
                            if (sourceTextures.indexOf(sourceSpriteInfo.textureName) == -1)
                                sourceTextures.push(sourceSpriteInfo.textureName);
                            var spriteModifierWhite = blueprintnotincluded_lib_1.BSpriteModifier.clone(sourceSpriteModifier);
                            spriteModifierWhite.name = spriteModifierWhite.name + '_white';
                            spriteModifierWhite.spriteInfoName = spriteModifierWhite.spriteInfoName + '_white';
                            spriteModifierWhite.tags.push(index_1.SpriteTag.white);
                            database.spriteModifiers.push(spriteModifierWhite);
                            var spriteInfoWhite = undefined;
                            for (var _i = 0, _a = database.uiSprites; _i < _a.length; _i++) {
                                var spriteInfo = _a[_i];
                                if (spriteInfo.name == sourceSpriteModifier.spriteInfoName)
                                    spriteInfoWhite = blueprintnotincluded_lib_1.BSpriteInfo.clone(spriteInfo);
                            }
                            if (spriteInfoWhite != undefined) {
                                spriteInfoWhite.name = spriteModifierWhite.spriteInfoName;
                                spriteInfoWhite.textureName = spriteInfoWhite.textureName + '_white';
                                database.uiSprites.push(spriteInfoWhite);
                            }
                            for (var _b = 0, _c = database.buildings; _b < _c.length; _b++) {
                                var building = _c[_b];
                                if (building.sprites.spriteNames.indexOf(sourceSpriteModifier.name) != -1)
                                    building.sprites.spriteNames.push(spriteModifierWhite.name);
                            }
                        };
                        for (_i = 0, sourceSpriteModifiers_1 = sourceSpriteModifiers; _i < sourceSpriteModifiers_1.length; _i++) {
                            sourceSpriteModifier = sourceSpriteModifiers_1[_i];
                            _loop_1(sourceSpriteModifier);
                        }
                        _a = 0, sourceTextures_1 = sourceTextures;
                        _b.label = 1;
                    case 1:
                        if (!(_a < sourceTextures_1.length)) return [3 /*break*/, 6];
                        sourceTexture = sourceTextures_1[_a];
                        if (!!blueprintnotincluded_lib_1.ImageSource.isTextureLoaded(sourceTexture)) return [3 /*break*/, 3];
                        imageUrl = blueprintnotincluded_lib_1.ImageSource.getUrl(sourceTexture);
                        return [4 /*yield*/, pixiNodeUtil.getImageWhite(imageUrl)];
                    case 2:
                        brt_1 = _b.sent();
                        blueprintnotincluded_lib_1.ImageSource.setBaseTexture(sourceTexture, brt_1);
                        _b.label = 3;
                    case 3:
                        baseTexture = blueprintnotincluded_lib_1.ImageSource.getBaseTexture(sourceTexture, pixiNodeUtil);
                        texture = pixiNodeUtil.getNewTextureWhole(baseTexture);
                        brt = pixiNodeUtil.getNewBaseRenderTexture({ width: texture.width, height: texture.height });
                        rt = pixiNodeUtil.getNewRenderTexture(brt);
                        sprite = pixiNodeUtil.getSpriteFrom(texture);
                        pixiNodeUtil.pixiApp.renderer.render(sprite, rt);
                        base64 = pixiNodeUtil.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();
                        return [4 /*yield*/, jimp.read(Buffer.from(base64.replace(/^data:image\/png;base64,/, ""), 'base64'))];
                    case 4:
                        white = _b.sent();
                        whitePath = './assets/images/' + sourceTexture + '_white.png';
                        console.log('saving white to ' + whitePath);
                        white.write(whitePath);
                        _b.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 1];
                    case 6:
                        data = JSON.stringify(database, null, 2);
                        fs.writeFileSync('./assets/database/database-white.json', data);
                        console.log('done generating white');
                        return [2 /*return*/];
                }
            });
        });
    };
    return GenerateWhite;
}());
exports.GenerateWhite = GenerateWhite;
// npm run generateWhite
new GenerateWhite();
