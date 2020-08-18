import * as fs from 'fs';
import { BExport, BActiveRangeSideScreen, BThresholdSwitchSideScreen, BBitSelectorSideScreen, BSingleSliderSideScreen, Vector2, SpriteTag } from "../../../../blueprintnotincluded-lib/index";
import { ImageSource, BuildableElement, BuildMenuCategory, BuildMenuItem, BSpriteInfo, SpriteInfo, BSpriteModifier, SpriteModifier, BBuilding, OniItem, MdbBlueprint } from '../../../../blueprintnotincluded-lib';
import { InfoIcon, BlueprintItemInfo } from '../../../../blueprintnotincluded-lib/src/blueprint/blueprint-item-info';


export class AddInfoIcons
{


  constructor() {

    console.log('Running batch FixHtmlLabels')

    // Read database
    let databaseToFix = './assets/database/' + process.argv[2];
    console.log('Adding info icons srpite infos and sprite modifiers to ' + databaseToFix);
    

    this.addInfoIcons(databaseToFix);
  }

  addInfoIcons(path: string) {

    let rawdata = fs.readFileSync(path).toString();
    let database = JSON.parse(rawdata) as BExport;

    let spriteModifierBack = new BSpriteModifier();
    spriteModifierBack.name = 'info_back';
    spriteModifierBack.spriteInfoName =  'info_back';
    spriteModifierBack.rotation = 0;
    spriteModifierBack.translation = Vector2.zero();
    spriteModifierBack.scale = Vector2.one();
    spriteModifierBack.tags = [SpriteTag.element_gas_back];
    database.spriteModifiers.push(spriteModifierBack);

    let spriteInfoBack = new BSpriteInfo();
    spriteInfoBack.name = 'info_back';
    spriteInfoBack.textureName = 'info_icon_back';
    spriteInfoBack.isIcon = false;
    spriteInfoBack.isInputOutput = false;
    spriteInfoBack.pivot = new Vector2(1, 0);
    spriteInfoBack.realSize = new Vector2(100, 100);
    spriteInfoBack.uvMin = new Vector2(0, 0);
    spriteInfoBack.uvSize = new Vector2(128, 128);
    database.uiSprites.push(spriteInfoBack);

    for (let i = 0; i < 12; i++) {
      let spriteModifierFront = new BSpriteModifier();
      spriteModifierFront.name = 'info_front_' + i;
      spriteModifierFront.spriteInfoName =  'info_front_' + i;
      spriteModifierFront.rotation = 0;
      spriteModifierFront.translation = Vector2.zero();
      spriteModifierFront.scale = Vector2.one();
      spriteModifierFront.tags = [SpriteTag.element_gas_front];
      database.spriteModifiers.push(spriteModifierFront);

      let spriteInfoFront = new BSpriteInfo();
      spriteInfoFront.name = 'info_front_' + i;
      spriteInfoFront.textureName = 'info_icon_front_' + i;
      spriteInfoFront.isIcon = false;
      spriteInfoFront.isInputOutput = false;
      spriteInfoFront.pivot = new Vector2(1, 0);
      spriteInfoFront.realSize = new Vector2(100, 100);
      spriteInfoFront.uvMin = new Vector2(0, 0);
      spriteInfoFront.uvSize = new Vector2(128, 128);
      database.uiSprites.push(spriteInfoFront);
    }


    let data = JSON.stringify(database, null, 2);
    fs.writeFileSync(path, data);
    
    console.log('done adding info icons');
  }
}

// npm run addInfoIcons -- database.json
new AddInfoIcons()