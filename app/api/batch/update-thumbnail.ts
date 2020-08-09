import dotenv from 'dotenv';
import { Database } from '../db';
import { BlueprintModel, Blueprint } from '../models/blueprint';
import * as fs from 'fs';
import { BatchUtils } from './batch-utils';
import { Blueprint as sharedBlueprint, Vector2, CameraService, Overlay, Display, PixiPolyfill } from "../../../../blueprintnotincluded-lib/index";
import { ImageSource, BuildableElement, BuildMenuCategory, BuildMenuItem, BSpriteInfo, SpriteInfo, BSpriteModifier, SpriteModifier, BBuilding, OniItem, MdbBlueprint } from '../../../../blueprintnotincluded-lib';
import { PixiBackend } from '../../pixi-backend';
require('../../pixi-shim/lib/node/canvas.js')


export class UpdateThumbnail
{
  public db: Database;

  constructor() {

    console.log('Running batch UpdateThumbnail')

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

    // initialize database and authentification middleware
    this.db = new Database();

    setTimeout(this.updateThumbnail, 3000);
  }

  static async generateThumbnail(angularBlueprint: sharedBlueprint) {
    
    let boundingBox = angularBlueprint.getBoundingBox();
    let topLeft = boundingBox[0];
    let bottomRight = boundingBox[1];
    let totalTileSize = new Vector2(bottomRight.x - topLeft.x + 3, bottomRight.y - topLeft.y + 3);

    let thumbnailSize = 200;
    let maxTotalSize = Math.max(totalTileSize.x, totalTileSize.y);
    let thumbnailTileSize = thumbnailSize / maxTotalSize;
    let cameraOffset = new Vector2(-topLeft.x + 1, bottomRight.y + 1);
    if (totalTileSize.x > totalTileSize.y) cameraOffset.y += totalTileSize.x / 2 - totalTileSize.y / 2;
    if (totalTileSize.y > totalTileSize.x) cameraOffset.x += totalTileSize.y / 2 - totalTileSize.x / 2;

    thumbnailTileSize = Math.floor(thumbnailTileSize);
    cameraOffset.x = Math.floor(cameraOffset.x);
    cameraOffset.y = Math.floor(cameraOffset.y);

    let exportCamera = new CameraService();
    exportCamera.setHardZoom(thumbnailTileSize);
    exportCamera.cameraOffset = cameraOffset;
    exportCamera.overlay = Overlay.Base;
    exportCamera.display = Display.solid;
    
    exportCamera.container = PixiPolyfill.pixiPolyfill.getNewContainer();
    exportCamera.container.sortableChildren = true;

    let graphics = PixiPolyfill.pixiPolyfill.getNewGraphics()
    exportCamera.container.addChild(graphics);

    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, 200, 200);
    graphics.endFill();

    angularBlueprint.blueprintItems.map((item) => { 
      item.updateTileables(angularBlueprint);
      item.drawPixi(exportCamera);
    });

    let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: thumbnailSize, height: thumbnailSize });
    let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);

    PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(exportCamera.container, rt, false);

    let base64: string = PixiPolyfill.pixiPolyfill.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();

    // Memory release
    exportCamera.container.destroy({children: true});
    brt.destroy();
    rt.destroy();

    console.log(base64)
    return base64;
  }

  async updateThumbnail() {

    await PixiBackend.initTextures();

    BlueprintModel.model.find({ }).sort({ createdAt: 1 })
      .then((blueprints) => {
        for (let index = blueprints.length - 1; index >= 0; index--) {
          console.log('==> Generating thumbnail for blueprint : ' + index + ' : ' +blueprints[index].name);
          
          let mdbBlueprint = blueprints[index].data as MdbBlueprint | null;
          let angularBlueprint: sharedBlueprint | null = new sharedBlueprint();
          angularBlueprint.importFromMdb(mdbBlueprint!);

          
          let newThumbnail = UpdateThumbnail.generateThumbnail(angularBlueprint);
          
          // Release memory
          mdbBlueprint = null;
          angularBlueprint = null;
          global.gc();

          break;
          blueprints[index].thumbnail = newThumbnail;
          blueprints[index].save()
          .then(() => { console.log('====> Save Ok for blueprint : ' + index + ' : ' +blueprints[index].name); })
          .catch(() => { console.log('====> Save Error for blueprint : ' + index + ' : ' +blueprints[index].name); })
          
        }
      });
  }
}

new UpdateThumbnail()