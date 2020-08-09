import dotenv from 'dotenv';
import { Database } from '../db';
import { BlueprintModel, Blueprint } from '../models/blueprint';
import * as fs from 'fs';
import Jimp, * as jimp from 'jimp';
import { BatchUtils } from './batch-utils';
import { Blueprint as sharedBlueprint, PixiPolyfill } from "../../../../blueprintnotincluded-lib/index";
import { ImageSource, BuildableElement, BuildMenuCategory, BuildMenuItem, BSpriteInfo, SpriteInfo, BSpriteModifier, SpriteModifier, BBuilding, OniItem, MdbBlueprint } from '../../../../blueprintnotincluded-lib';
import { PixiBackend } from '../../pixi-backend';
import app from '../../app';


export class GenerateIcons
{
  constructor() {

    console.log('Running batch GenerateIcons')

    // initialize configuration
    dotenv.config();
    console.log(process.env.ENV_NAME);

    // Read database
    let rawdata = fs.readFileSync('./assets/database/database.json').toString();
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

    setTimeout(this.generateIcons, 3000);
  }

  async generateIcons() {

    //await PixiBackend.initTextures();

    console.log('start generating icons')
    for (let k of SpriteInfo.keys.filter(s => SpriteInfo.getSpriteInfo(s).isIcon))
    {
      console.log('generating icon for ' + k);
      let uiSpriteInfo = SpriteInfo.getSpriteInfo(k);

      if (!ImageSource.isTextureLoaded(uiSpriteInfo.imageId)) {
        let imageUrl = ImageSource.getUrl(uiSpriteInfo.imageId);
        let brt = await PixiBackend.pixiBackend.getImage(imageUrl);
        ImageSource.setBaseTexture(uiSpriteInfo.imageId, brt);
      }
      
      let texture = uiSpriteInfo.getTexture();
      let uiSprite = PixiPolyfill.pixiPolyfill.getNewSprite(texture);

      let size = Math.max(texture.width, texture.height)

      let container = PixiPolyfill.pixiPolyfill.getNewContainer();
      container.addChild(uiSprite);

      uiSprite.x = 0;
      uiSprite.y = 0;

      if (texture.width > texture.height) uiSprite.y += (texture.width / 2 - texture.height / 2);
      if (texture.height > texture.width) uiSprite.x += (texture.height / 2 - texture.width / 2);

      let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: size, height: size});
      let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);

      PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(container, rt, true);
      let base64: string = PixiPolyfill.pixiPolyfill.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();
      
      let icon = await jimp.read(Buffer.from(base64.replace(/^data:image\/png;base64,/, ""), 'base64'));
      let iconPath = './assets/images/ui/' + k + '.png';
      console.log('saving icon to ' + iconPath);
      icon.write(iconPath);

      // Free memory
      brt.destroy();
      brt = null;
      rt.destroy();
      rt = null;
      container.destroy({children: true});
      container = null;
      global.gc();
    }
    console.log('done generating icons')
  }
}

new GenerateIcons()