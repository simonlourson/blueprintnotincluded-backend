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
var bin_controller_1 = require("./bin-packing/bin-controller");
var pixi_node_util_1 = require("../pixi-node-util");
var GenerateRepack = /** @class */ (function () {
    function GenerateRepack() {
        console.log('Running batch GenerateRepack');
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Read database
        var rawdata = fs.readFileSync('./assets/database/database-white.json').toString();
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
        this.generateRepack(json);
    }
    GenerateRepack.prototype.generateRepack = function (database) {
        return __awaiter(this, void 0, void 0, function () {
            var pixiNodeUtil, traySize, textureBaseString, binController, bleed, newSpriteInfos, _i, _a, spriteInfo, newSpriteInfo, _b, newSpriteInfos_1, spriteInfo, itemAdded, _loop_1, trayIndex, data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pixiNodeUtil = new pixi_node_util_1.PixiNodeUtil({ forceCanvas: true, preserveDrawingBuffer: true });
                        return [4 /*yield*/, pixiNodeUtil.initTextures()];
                    case 1:
                        _c.sent();
                        traySize = 1024;
                        textureBaseString = 'repack_';
                        binController = new bin_controller_1.BinController(new index_1.Vector2(traySize, traySize));
                        bleed = new index_1.Vector2(10, 10);
                        newSpriteInfos = [];
                        for (_i = 0, _a = blueprintnotincluded_lib_1.SpriteInfo.spriteInfos; _i < _a.length; _i++) {
                            spriteInfo = _a[_i];
                            // We don't need the ui icons in the texture atlases for pixi
                            if (spriteInfo.isIcon && !spriteInfo.isInputOutput)
                                continue;
                            newSpriteInfo = new blueprintnotincluded_lib_1.BSpriteInfo();
                            newSpriteInfo.name = spriteInfo.spriteInfoId;
                            newSpriteInfo.uvMin = index_1.Vector2.cloneNullToZero(spriteInfo.uvMin);
                            newSpriteInfo.uvSize = index_1.Vector2.cloneNullToZero(spriteInfo.uvSize);
                            newSpriteInfo.realSize = index_1.Vector2.cloneNullToZero(spriteInfo.realSize);
                            newSpriteInfo.pivot = index_1.Vector2.cloneNullToZero(spriteInfo.pivot);
                            newSpriteInfo.isIcon = spriteInfo.isIcon;
                            newSpriteInfo.isInputOutput = spriteInfo.isInputOutput;
                            newSpriteInfos.push(newSpriteInfo);
                        }
                        // Sort our new array of BSpriteInfo by descending height
                        newSpriteInfos = newSpriteInfos.sort(function (i1, i2) { return i2.uvSize.y - i1.uvSize.y; });
                        for (_b = 0, newSpriteInfos_1 = newSpriteInfos; _b < newSpriteInfos_1.length; _b++) {
                            spriteInfo = newSpriteInfos_1[_b];
                            itemAdded = binController.addItem(spriteInfo.name, index_1.Vector2.cloneNullToZero(spriteInfo.uvSize), bleed);
                            if (itemAdded != null) {
                                spriteInfo.uvMin = index_1.Vector2.cloneNullToZero(itemAdded.uvStart);
                                spriteInfo.textureName = textureBaseString + itemAdded.trayIndex;
                            }
                        }
                        database.uiSprites = newSpriteInfos;
                        _loop_1 = function (trayIndex) {
                            var brt, rt, graphics, container, _i, _a, spriteInfo, repackBleed, realBleed, texture, sprite, base64, repack, repackPath;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        brt = pixiNodeUtil.getNewBaseRenderTexture({ width: binController.binTrays[trayIndex].binSize.x, height: binController.binTrays[trayIndex].binSize.y });
                                        rt = pixiNodeUtil.getNewRenderTexture(brt);
                                        graphics = pixiNodeUtil.getNewGraphics();
                                        container = pixiNodeUtil.getNewContainer();
                                        container.addChild(graphics);
                                        for (_i = 0, _a = newSpriteInfos.filter(function (s) { return s.textureName == textureBaseString + trayIndex; }); _i < _a.length; _i++) {
                                            spriteInfo = _a[_i];
                                            repackBleed = 5;
                                            realBleed = new index_1.Vector2();
                                            texture = blueprintnotincluded_lib_1.SpriteInfo.getSpriteInfo(spriteInfo.name).getTextureWithBleed(repackBleed, realBleed, pixiNodeUtil);
                                            sprite = pixiNodeUtil.getSpriteFrom(texture);
                                            sprite.x = spriteInfo.uvMin.x - realBleed.x;
                                            sprite.y = spriteInfo.uvMin.y - realBleed.y;
                                            container.addChild(sprite);
                                            //graphics.beginFill(0x007AD9);
                                            //graphics.drawRect(spriteInfo.uvMin.x, spriteInfo.uvMin.y, spriteInfo.uvSize.x, spriteInfo.uvSize.y);
                                            //graphics.endFill();
                                        }
                                        pixiNodeUtil.pixiApp.renderer.render(container, rt, true);
                                        base64 = pixiNodeUtil.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();
                                        return [4 /*yield*/, jimp.read(Buffer.from(base64.replace(/^data:image\/png;base64,/, ""), 'base64'))];
                                    case 1:
                                        repack = _b.sent();
                                        repackPath = './assets/images/' + textureBaseString + trayIndex + '.png';
                                        console.log('saving repack to ' + repackPath);
                                        repack.write(repackPath);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        trayIndex = 0;
                        _c.label = 2;
                    case 2:
                        if (!(trayIndex < binController.binTrays.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(trayIndex)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        trayIndex++;
                        return [3 /*break*/, 2];
                    case 5:
                        data = JSON.stringify(database, null, 2);
                        fs.writeFileSync('./assets/database/database-repack.json', data);
                        console.log('done generating repack');
                        return [2 /*return*/];
                }
            });
        });
    };
    return GenerateRepack;
}());
exports.GenerateRepack = GenerateRepack;
// npm run generateRepack
new GenerateRepack();
