import dotenv from 'dotenv';
import { Database } from '../db';
import { BlueprintModel, Blueprint } from '../models/blueprint';
import * as fs from 'fs';
import Jimp, * as jimp from 'jimp';
import { BatchUtils } from './batch-utils';
import { Blueprint as sharedBlueprint, PixiPolyfill, BExport, SpriteTag, Vector2 } from "../../../../blueprintnotincluded-lib/index";
import { ImageSource, BuildableElement, BuildMenuCategory, BuildMenuItem, BSpriteInfo, SpriteInfo, BSpriteModifier, SpriteModifier, BBuilding, OniItem, MdbBlueprint } from '../../../../blueprintnotincluded-lib';
import { PixiBackend } from '../../pixi-backend';
import app from '../../app';


export class GenerateRepack
{
  constructor() {

    console.log('Running batch GenerateRepack')

    // initialize configuration
    dotenv.config();
    console.log(process.env.ENV_NAME);

    // Read database
    let rawdata = fs.readFileSync('./assets/database/database-white.json').toString();
    let json = JSON.parse(rawdata);

    ImageSource.init();

    let elements: BuildableElement[] = json.elements;
    BuildableElement.init();
    BuildableElement.load(elements);

    let buildMenuCategories: BuildMenuCategory[] = json.buildMenuCategories;
    BuildMenuCategory.init();
    BuildMenuCategory.load(buildMenuCategories);

    let buildMenuItems: BuildMenuItem[] = json.buildMenuItems;
    BuildMenuItem.init();
    BuildMenuItem.load(buildMenuItems);

    let uiSprites: BSpriteInfo[] = json.uiSprites;
    SpriteInfo.init();
    SpriteInfo.load(uiSprites)

    let spriteModifiers: BSpriteModifier[] = json.spriteModifiers;
    SpriteModifier.init();
    SpriteModifier.load(spriteModifiers);
    
    let buildings: BBuilding[] = json.buildings;
    OniItem.init();
    OniItem.load(buildings);

    this.generateRepack(json);
  }

  async generateRepack(database: BExport) {
    // Tests bintrays
    let traySize = 1024;
    let textureBaseString = 'repack_';
    let binController = new BinController(new Vector2(traySize, traySize));

    let bleed = new Vector2(10, 10);
    /*
    // Tests
    binController.addItem('test_0', new Vector2(50, 50), bleed);
    binController.addItem('test_1', new Vector2(50, 50), bleed);
    binController.addItem('test_2', new Vector2(10, 50), bleed);
    binController.addItem('test_3', new Vector2(10, 50), bleed);
    */

    // First, we clone the existing spriteInfos into a new array :
    let newSpriteInfos: BSpriteInfo[] = [];

    for (let spriteInfo of SpriteInfo.spriteInfos) {
      // Copy the sprite info into the BSpriteInfo.
      // We need to start from the start info because some of them are generated (tiles)
      let newSpriteInfo = new BSpriteInfo();
      newSpriteInfo.name = spriteInfo.spriteInfoId;
      newSpriteInfo.uvMin = Vector2.clone(spriteInfo.uvMin);
      newSpriteInfo.uvSize = Vector2.clone(spriteInfo.uvSize);
      newSpriteInfo.realSize = Vector2.clone(spriteInfo.realSize);
      newSpriteInfo.pivot = Vector2.clone(spriteInfo.pivot);
      newSpriteInfo.isIcon = spriteInfo.isIcon;
      newSpriteInfos.push(newSpriteInfo);
    }

    // Sort our new array of BSpriteInfo by descending height
    newSpriteInfos = newSpriteInfos.sort((i1, i2) => { return i2.uvSize.y - i1.uvSize.y; });

    for (let spriteInfo of newSpriteInfos) {
      let itemAdded  = binController.addItem(spriteInfo.name, Vector2.clone(spriteInfo.uvSize), bleed);
      if (itemAdded != null) {
        spriteInfo.uvMin = Vector2.clone(itemAdded.uvStart);
        spriteInfo.textureName = textureBaseString + itemAdded.trayIndex;
      }
    }

    
    database.uiSprites = newSpriteInfos;

    ComponentCanvasComponent.zip = new JSZip();
    ComponentCanvasComponent.nbBlob = 0;
    ComponentCanvasComponent.downloadFile = 'repackedTextureAndDatabase.zip';
    ComponentCanvasComponent.nbBlobMax = binController.binTrays.length;

    ComponentCanvasComponent.zip.file('database_repacked.json', JSON.stringify(database, null, 2));


    for (let trayIndex = 0; trayIndex < binController.binTrays.length; trayIndex++) {
      let brt = new PIXI.BaseRenderTexture({width: binController.binTrays[trayIndex].binSize.x, height: binController.binTrays[trayIndex].binSize.y});
      let rt = new PIXI.RenderTexture(brt);

      let graphics = new PIXI.Graphics();
      let container = new PIXI.Container();
      container.addChild(graphics);

      for (let spriteInfo of newSpriteInfos.filter((s) => { return s.textureName == textureBaseString + trayIndex; })) {
        let repackBleed = 5;
        let realBleed = new Vector2();
        let texture = SpriteInfo.getSpriteInfo(spriteInfo.name).getTextureWithBleed(repackBleed, realBleed);
        let sprite = PIXI.Sprite.from(texture);

        sprite.x = spriteInfo.uvMin.x - realBleed.x;
        sprite.y = spriteInfo.uvMin.y - realBleed.y;
        container.addChild(sprite);

        //graphics.beginFill(0x007AD9);
        //graphics.drawRect(spriteInfo.uvMin.x, spriteInfo.uvMin.y, spriteInfo.uvSize.x, spriteInfo.uvSize.y);
        //graphics.endFill();
      }

      this.drawPixi.pixiApp.renderer.render(container, rt, true);

      this.drawPixi.pixiApp.renderer.extract.canvas(rt).toBlob((b) => 
      {
        this.addBlob(b, textureBaseString + trayIndex + '.png');
      }, 'image/png');
    }
  }

}


new GenerateWhite()