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
Object.defineProperty(exports, "__esModule", { value: true });
var blueprintnotincluded_lib_1 = require("../../blueprintnotincluded-lib");
var pixi_polyfill_1 = require("../../blueprintnotincluded-lib/src/drawing/pixi-polyfill");
var jimp_1 = __importDefault(require("jimp"));
//var PIXI = require('../../blueprintnotincluded-lib/src/pixi-polyfill')
var PixiBackend = /** @class */ (function () {
    function PixiBackend() {
    }
    PixiBackend.initTextures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var miniTest, _i, _a, k, imageUrl, brt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pixi_polyfill_1.PixiPolyfill.backend = true;
                        miniTest = [
                            'repack_74',
                            'repack_76',
                            'repack_77',
                            'repack_82',
                            'repack_83',
                            'repack_86',
                            'repack_90',
                            'repack_95',
                            'repack_96',
                            'repack_97',
                            'repack_98'
                        ];
                        console.log('starting render');
                        console.log(new Date());
                        _i = 0, _a = blueprintnotincluded_lib_1.ImageSource.keys;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        k = _a[_i];
                        imageUrl = blueprintnotincluded_lib_1.ImageSource.getUrl(k);
                        return [4 /*yield*/, PixiBackend.pixiBackend.getImage(imageUrl)];
                    case 2:
                        brt = _b.sent();
                        blueprintnotincluded_lib_1.ImageSource.setBaseTexture(k, brt);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log(new Date());
                        console.log('render done for all');
                        return [2 /*return*/];
                }
            });
        });
    };
    PixiBackend.prototype.generateThumbnail = function (angularBlueprint) {
        var boundingBox = angularBlueprint.getBoundingBox();
        var topLeft = boundingBox[0];
        var bottomRight = boundingBox[1];
        var totalTileSize = new blueprintnotincluded_lib_1.Vector2(bottomRight.x - topLeft.x + 3, bottomRight.y - topLeft.y + 3);
        var thumbnailSize = 200;
        var maxTotalSize = Math.max(totalTileSize.x, totalTileSize.y);
        var thumbnailTileSize = thumbnailSize / maxTotalSize;
        var cameraOffset = new blueprintnotincluded_lib_1.Vector2(-topLeft.x + 1, bottomRight.y + 1);
        if (totalTileSize.x > totalTileSize.y)
            cameraOffset.y += totalTileSize.x / 2 - totalTileSize.y / 2;
        if (totalTileSize.y > totalTileSize.x)
            cameraOffset.x += totalTileSize.y / 2 - totalTileSize.x / 2;
        thumbnailTileSize = Math.floor(thumbnailTileSize);
        cameraOffset.x = Math.floor(cameraOffset.x);
        cameraOffset.y = Math.floor(cameraOffset.y);
        var exportCamera = new blueprintnotincluded_lib_1.CameraService();
        exportCamera.setHardZoom(thumbnailTileSize);
        exportCamera.cameraOffset = cameraOffset;
        exportCamera.overlay = blueprintnotincluded_lib_1.Overlay.Base;
        exportCamera.display = blueprintnotincluded_lib_1.Display.solid;
        exportCamera.container = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewContainer();
        exportCamera.container.sortableChildren = true;
        var graphics = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewGraphics();
        exportCamera.container.addChild(graphics);
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, 200, 200);
        graphics.endFill();
        angularBlueprint.blueprintItems.map(function (item) {
            item.updateTileables(angularBlueprint);
            item.drawPixi(exportCamera);
        });
        var brt = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({ width: thumbnailSize, height: thumbnailSize });
        var rt = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);
        pixi_polyfill_1.PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(exportCamera.container, rt, false);
        var base64 = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();
        // Memory release
        exportCamera.container.destroy({ children: true });
        brt.destroy();
        rt.destroy();
        return base64;
    };
    PixiBackend.prototype.getImage = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var image, width, height, brt, rt, graphics, container, x, y, color, alpha;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jimp_1.default.read(path)];
                    case 1:
                        image = _a.sent();
                        width = image.getWidth();
                        height = image.getHeight();
                        brt = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({ width: width, height: height });
                        rt = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);
                        graphics = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewGraphics();
                        container = pixi_polyfill_1.PixiPolyfill.pixiPolyfill.getNewContainer();
                        container.addChild(graphics);
                        for (x = 0; x < width; x++)
                            for (y = 0; y < height; y++) {
                                color = image.getPixelColor(x, y);
                                alpha = jimp_1.default.intToRGBA(color).a;
                                color = color >> 8;
                                graphics.beginFill(color, alpha);
                                graphics.drawRect(x, y, 1, 1);
                                graphics.endFill();
                            }
                        pixi_polyfill_1.PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(container, rt, false);
                        // Release memory
                        container.destroy({ children: true });
                        container = null;
                        rt.destroy();
                        rt = null;
                        global.gc();
                        console.log('render done for ' + path);
                        return [2 /*return*/, brt];
                }
            });
        });
    };
    PixiBackend.pixiBackend = new PixiBackend();
    return PixiBackend;
}());
exports.PixiBackend = PixiBackend;
