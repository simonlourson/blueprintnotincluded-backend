"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var index_1 = require("../../../../blueprintnotincluded-lib/index");
var blueprintnotincluded_lib_1 = require("../../../../blueprintnotincluded-lib");
var AddInfoIcons = /** @class */ (function () {
    function AddInfoIcons() {
        console.log('Running batch FixHtmlLabels');
        // Read database
        var databaseToFix = './assets/database/' + process.argv[2];
        console.log('Adding info icons srpite infos and sprite modifiers to ' + databaseToFix);
        this.addInfoIcons(databaseToFix);
    }
    AddInfoIcons.prototype.addInfoIcons = function (path) {
        var rawdata = fs.readFileSync(path).toString();
        var database = JSON.parse(rawdata);
        var spriteModifiersNames = [
            'element_tile_back',
            'gas_tile_front',
            'liquid_tile_front',
            'vacuum_tile_front',
            'info_back'
        ];
        var spriteModifierTags = [
            index_1.SpriteTag.element_back,
            index_1.SpriteTag.element_gas_front,
            index_1.SpriteTag.element_liquid_front,
            index_1.SpriteTag.element_vacuum_front,
            index_1.SpriteTag.info_back
        ];
        for (var i = 0; i < 12; i++) {
            spriteModifiersNames.push('info_front_' + i);
            spriteModifierTags.push(index_1.SpriteTag.info_front);
        }
        for (var i = 0; i < spriteModifiersNames.length; i++) {
            var spriteModifier = new blueprintnotincluded_lib_1.BSpriteModifier();
            spriteModifier.name = spriteModifiersNames[i];
            spriteModifier.spriteInfoName = spriteModifiersNames[i];
            spriteModifier.rotation = 0;
            spriteModifier.translation = index_1.Vector2.zero();
            spriteModifier.scale = index_1.Vector2.one();
            spriteModifier.tags = [spriteModifierTags[i]];
            database.spriteModifiers.push(spriteModifier);
            var spriteInfoBack = new blueprintnotincluded_lib_1.BSpriteInfo();
            spriteInfoBack.name = spriteModifiersNames[i];
            spriteInfoBack.textureName = spriteModifiersNames[i];
            spriteInfoBack.isIcon = false;
            spriteInfoBack.isInputOutput = false;
            spriteInfoBack.pivot = new index_1.Vector2(1, 0);
            spriteInfoBack.realSize = new index_1.Vector2(100, 100);
            spriteInfoBack.uvMin = new index_1.Vector2(0, 0);
            spriteInfoBack.uvSize = new index_1.Vector2(128, 128);
            database.uiSprites.push(spriteInfoBack);
        }
        var data = JSON.stringify(database, null, 2);
        fs.writeFileSync(path, data);
        console.log('done adding info icons');
    };
    return AddInfoIcons;
}());
exports.AddInfoIcons = AddInfoIcons;
// npm run addInfoIcons -- database.json
new AddInfoIcons();
