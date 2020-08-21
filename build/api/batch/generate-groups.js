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
var GenerateGroups = /** @class */ (function () {
    function GenerateGroups() {
        console.log('Running batch GenerateGroups');
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Read database
        var rawdata = fs.readFileSync('./assets/database/database.json').toString();
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
        this.generateGroups(json);
    }
    GenerateGroups.prototype.generateGroups = function (database) {
        return __awaiter(this, void 0, void 0, function () {
            var pixiNodeUtil, _loop_1, _i, _a, oniItem, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pixiNodeUtil = new pixi_node_util_1.PixiNodeUtil({ forceCanvas: true, preserveDrawingBuffer: true });
                        return [4 /*yield*/, pixiNodeUtil.initTextures()];
                    case 1:
                        _b.sent();
                        _loop_1 = function (oniItem) {
                            var buildingInDatabase, spritesToGroup, _i, _a, spriteModifier, container, modifierId, spriteInfoId, textureName, indexDrawPart, _loop_2, _b, _c, spriteModifier, bounds, diff, _d, _e, child, pivot, newSpriteModifier, newSpriteInfo, brt, rt, base64, group, groupePath;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (oniItem.id == blueprintnotincluded_lib_1.OniItem.elementId || oniItem.id == blueprintnotincluded_lib_1.OniItem.infoId)
                                            return [2 /*return*/, "continue"];
                                        buildingInDatabase = database.buildings.find(function (building) { return building.prefabId == oniItem.id; });
                                        if (buildingInDatabase == undefined)
                                            throw new Error('GenerateGroups.generateGroups : building not found : ' + oniItem.id);
                                        spritesToGroup = [];
                                        for (_i = 0, _a = oniItem.spriteGroup.spriteModifiers; _i < _a.length; _i++) {
                                            spriteModifier = _a[_i];
                                            if (spriteModifier == undefined)
                                                console.log(oniItem);
                                            if (spriteModifier.tags.indexOf(index_1.SpriteTag.solid) != -1 &&
                                                spriteModifier.tags.indexOf(index_1.SpriteTag.tileable) == -1 &&
                                                spriteModifier.tags.indexOf(index_1.SpriteTag.connection) == -1)
                                                spritesToGroup.push(spriteModifier);
                                        }
                                        if (!(spritesToGroup.length > 1)) return [3 /*break*/, 2];
                                        container = pixiNodeUtil.getNewContainer();
                                        container.sortableChildren = true;
                                        modifierId = oniItem.id + '_group_modifier';
                                        spriteInfoId = oniItem.id + '_group_sprite';
                                        textureName = oniItem.id + '_group_sprite';
                                        indexDrawPart = 0;
                                        _loop_2 = function (spriteModifier) {
                                            if (spriteModifier.tags.indexOf(index_1.SpriteTag.solid) == -1 ||
                                                spriteModifier.tags.indexOf(index_1.SpriteTag.tileable) != -1 ||
                                                spriteModifier.tags.indexOf(index_1.SpriteTag.connection) != -1)
                                                return "continue";
                                            // Remove from the database building sprite list
                                            var indexToRemove = buildingInDatabase.sprites.spriteNames.indexOf(spriteModifier.spriteModifierId);
                                            buildingInDatabase.sprites.spriteNames.splice(indexToRemove, 1);
                                            // Then from the sprite modifiers
                                            var spriteModifierToRemove = database.spriteModifiers.find(function (s) { return s.name == spriteModifier.spriteModifierId; });
                                            if (spriteModifierToRemove != null) {
                                                indexToRemove = database.spriteModifiers.indexOf(spriteModifierToRemove);
                                                database.spriteModifiers.splice(indexToRemove, 1);
                                            }
                                            var spriteInfoToRemove = database.uiSprites.find(function (s) { return s.name == spriteModifier.spriteInfoName; });
                                            if (spriteInfoToRemove != null) {
                                                indexToRemove = database.uiSprites.indexOf(spriteInfoToRemove);
                                                database.uiSprites.splice(indexToRemove, 1);
                                            }
                                            var spriteInfo = blueprintnotincluded_lib_1.SpriteInfo.getSpriteInfo(spriteModifier.spriteInfoName);
                                            var texture = spriteInfo.getTexture(pixiNodeUtil);
                                            var sprite = pixiNodeUtil.getSpriteFrom(texture);
                                            sprite.anchor.set(spriteInfo.pivot.x, 1 - spriteInfo.pivot.y);
                                            sprite.x = 0 + (spriteModifier.translation.x);
                                            sprite.y = 0 - (spriteModifier.translation.y);
                                            sprite.width = spriteInfo.realSize.x;
                                            sprite.height = spriteInfo.realSize.y;
                                            sprite.scale.x = spriteModifier.scale.x;
                                            sprite.scale.y = spriteModifier.scale.y;
                                            sprite.angle = -spriteModifier.rotation;
                                            sprite.zIndex -= (indexDrawPart / 50);
                                            container.addChild(sprite);
                                            indexDrawPart++;
                                        };
                                        for (_b = 0, _c = oniItem.spriteGroup.spriteModifiers; _b < _c.length; _b++) {
                                            spriteModifier = _c[_b];
                                            _loop_2(spriteModifier);
                                        }
                                        buildingInDatabase.sprites.spriteNames.push(modifierId);
                                        container.calculateBounds();
                                        bounds = container.getBounds();
                                        bounds.x = Math.floor(bounds.x);
                                        bounds.y = Math.floor(bounds.y);
                                        bounds.width = Math.ceil(bounds.width);
                                        bounds.height = Math.ceil(bounds.height);
                                        diff = new index_1.Vector2(bounds.x, bounds.y);
                                        for (_d = 0, _e = container.children; _d < _e.length; _d++) {
                                            child = _e[_d];
                                            child.x -= diff.x;
                                            child.y -= diff.y;
                                        }
                                        pivot = new index_1.Vector2(1 - ((bounds.width + bounds.x) / bounds.width), ((bounds.height + bounds.y) / bounds.height));
                                        newSpriteModifier = new blueprintnotincluded_lib_1.BSpriteModifier();
                                        newSpriteModifier.name = modifierId;
                                        newSpriteModifier.spriteInfoName = spriteInfoId;
                                        newSpriteModifier.rotation = 0;
                                        newSpriteModifier.scale = new index_1.Vector2(1, 1);
                                        newSpriteModifier.translation = new index_1.Vector2(0, 0);
                                        newSpriteModifier.tags = [index_1.SpriteTag.solid];
                                        database.spriteModifiers.push(newSpriteModifier);
                                        newSpriteInfo = new blueprintnotincluded_lib_1.BSpriteInfo();
                                        newSpriteInfo.name = spriteInfoId;
                                        newSpriteInfo.textureName = textureName;
                                        newSpriteInfo.pivot = pivot;
                                        newSpriteInfo.uvMin = new index_1.Vector2(0, 0);
                                        newSpriteInfo.realSize = new index_1.Vector2(bounds.width, bounds.height);
                                        newSpriteInfo.uvSize = new index_1.Vector2(bounds.width, bounds.height);
                                        database.uiSprites.push(newSpriteInfo);
                                        brt = pixiNodeUtil.getNewBaseRenderTexture({ width: bounds.width, height: bounds.height });
                                        rt = pixiNodeUtil.getNewRenderTexture(brt);
                                        pixiNodeUtil.pixiApp.renderer.render(container, rt);
                                        base64 = pixiNodeUtil.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();
                                        return [4 /*yield*/, jimp.read(Buffer.from(base64.replace(/^data:image\/png;base64,/, ""), 'base64'))];
                                    case 1:
                                        group = _f.sent();
                                        groupePath = './assets/images/' + textureName + '.png';
                                        console.log('saving group to ' + groupePath);
                                        group.write(groupePath);
                                        // Free memory
                                        brt.destroy();
                                        brt = null;
                                        rt.destroy();
                                        rt = null;
                                        container.destroy({ children: true });
                                        container = null;
                                        global.gc();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        console.log(oniItem.id + ' should not be grouped');
                                        _f.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = blueprintnotincluded_lib_1.OniItem.oniItems;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        oniItem = _a[_i];
                        return [5 /*yield**/, _loop_1(oniItem)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        data = JSON.stringify(database, null, 2);
                        fs.writeFileSync('./assets/database/database-groups.json', data);
                        console.log('done generating groups');
                        return [2 /*return*/];
                }
            });
        });
    };
    return GenerateGroups;
}());
exports.GenerateGroups = GenerateGroups;
// npm run generateGroups
new GenerateGroups();
