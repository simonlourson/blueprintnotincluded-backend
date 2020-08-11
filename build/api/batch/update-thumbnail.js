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
var db_1 = require("../db");
var blueprint_1 = require("../models/blueprint");
var fs = __importStar(require("fs"));
var blueprintnotincluded_lib_1 = require("../../../../blueprintnotincluded-lib");
var pixi_node_util_1 = require("../pixi-node-util");
var UpdateThumbnail = /** @class */ (function () {
    function UpdateThumbnail() {
        console.log('Running batch UpdateThumbnail');
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Read database
        var rawdata = fs.readFileSync('./assets/database/database-repack.json').toString();
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
        // initialize database and authentification middleware
        this.db = new db_1.Database();
        setTimeout(this.updateThumbnail, 3000);
    }
    UpdateThumbnail.prototype.updateThumbnail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pixiNodeUtil;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pixiNodeUtil = new pixi_node_util_1.PixiNodeUtil({ forceCanvas: true, preserveDrawingBuffer: true });
                        return [4 /*yield*/, pixiNodeUtil.initTextures()];
                    case 1:
                        _a.sent();
                        blueprint_1.BlueprintModel.model.find({}).sort({ createdAt: 1 })
                            .then(function (blueprints) {
                            var _loop_1 = function (index) {
                                console.log('==> Generating thumbnail for blueprint : ' + index + ' : ' + blueprints[index].name);
                                var mdbBlueprint = blueprints[index].data;
                                var angularBlueprint = new blueprintnotincluded_lib_1.Blueprint();
                                angularBlueprint.importFromMdb(mdbBlueprint);
                                var newThumbnail = pixiNodeUtil.generateThumbnail(angularBlueprint);
                                // Release memory
                                mdbBlueprint = null;
                                angularBlueprint = null;
                                global.gc();
                                blueprints[index].thumbnail = newThumbnail;
                                blueprints[index].save()
                                    .then(function () { console.log('====> Save Ok for blueprint : ' + index + ' : ' + blueprints[index].name); })
                                    .catch(function () { console.log('====> Save Error for blueprint : ' + index + ' : ' + blueprints[index].name); });
                            };
                            for (var index = blueprints.length - 1; index >= 0; index--) {
                                _loop_1(index);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return UpdateThumbnail;
}());
exports.UpdateThumbnail = UpdateThumbnail;
new UpdateThumbnail();
