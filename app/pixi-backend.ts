import { Blueprint, Vector2, CameraService, Overlay, Display, ImageSource } from '../../blueprintnotincluded-lib';
import { PixiPolyfill } from '../../blueprintnotincluded-lib/src/drawing/pixi-polyfill';
import Jimp from 'jimp';
const fs = require('fs');
//var PIXI = require('../../blueprintnotincluded-lib/src/pixi-polyfill')

export class PixiBackend
{

  public static pixiBackend: PixiBackend = new PixiBackend();

  constructor() {
  }

  static async initTextures() {

    PixiPolyfill.backend = true;

    let miniTest  = [
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

    console.log('starting render')
    console.log(new Date());
    for (let k of ImageSource.keys) {
    //for (let k of miniTest) {
      let imageUrl = ImageSource.getUrl(k)!;
      let brt = await PixiBackend.pixiBackend.getImage(imageUrl);
      ImageSource.setBaseTexture(k, brt);
    }

    console.log(new Date());
    console.log('render done for all');
  }

  generateThumbnail(angularBlueprint: Blueprint) {
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

    return base64;
  }

  async getImage(path: string) {

    let useJsonData = true;

    let data: any = {};
    let width = 0;
    let height = 0;

    if (useJsonData) {
      console.log('reading ' + path.replace('png', 'json'));
      let rawdata = fs.readFileSync(path.replace('png', 'json'));
      data = JSON.parse(rawdata);
      rawdata = null;

      width = data.width;
      height = data.height;
    }
    else {
      console.log('reading ' + path);
      data = await Jimp.read(path);
      width = data.getWidth();
      height = data.getHeight();
    }

    let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: width, height: height });
    let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);

    let graphics = PixiPolyfill.pixiPolyfill.getNewGraphics();

    let container = PixiPolyfill.pixiPolyfill.getNewContainer();
    container.addChild(graphics);

    let jsonExport: any = {};

    if (!useJsonData) {
      jsonExport.width = width;
      jsonExport.height = height;
      jsonExport.data = [];
    }

    let index: number = 0;
    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++) {

        if (useJsonData) {
          let colorObject: any = {r: 0, g: 0, b: 0, a: 0};

          let bitmapData: number[] = data.data;

          colorObject.r = bitmapData[index]; index++;
          colorObject.g = bitmapData[index]; index++;
          colorObject.b = bitmapData[index]; index++;
          colorObject.a = bitmapData[index]; index++;

          let alpha = colorObject.a;

          let color = Jimp.rgbaToInt(colorObject.r, colorObject.g, colorObject.b, colorObject.a);
          color = color >> 8;

          graphics.beginFill(color, alpha);
        }
        else {
          let color = data.getPixelColor(x, y);
          let colorObject = Jimp.intToRGBA(color);
          let alpha = colorObject.a;
          color = color >> 8;

          jsonExport.data[index] = colorObject.r; index++;
          jsonExport.data[index] = colorObject.g; index++;
          jsonExport.data[index] = colorObject.b; index++;
          jsonExport.data[index] = colorObject.a; index++;

          graphics.beginFill(color, alpha);
        }
        

        
        graphics.drawRect(x, y, 1, 1);
        graphics.endFill();
      }

    if (!useJsonData) {
      let jsonExportString = JSON.stringify(jsonExport);
      fs.writeFileSync(path.replace('png', 'json'), jsonExportString);
    }
    
    PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(container, rt, false);

    // Release memory
    container.destroy({children: true});
    container = null;
    rt.destroy();
    rt = null;
    data = null;
    global.gc();

    console.log('render done for ' + path);
    return brt;
  }
}