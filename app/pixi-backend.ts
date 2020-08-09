import { Blueprint, Vector2, CameraService, Overlay, Display, ImageSource, NodeCanvasResource } from '../../blueprintnotincluded-lib';
//import { PixiPolyfill } from '../../blueprintnotincluded-lib/src/drawing/pixi-polyfill';
import Jimp from 'jimp';
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
import 'pixi.js-legacy'
var PIXI = require('pixi.js-legacy')
require('./canvas.js')

export class PixiBackend
{

  public static pixiBackend: PixiBackend = new PixiBackend();

  constructor() {
  }

  static async initTextures() {

    //PixiPolyfill.backend = true;

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
    // DEBUG remove when done
    //for (let k of miniTest) {

      // DEBUG remove when done
      //if (k != 'desalinator_0') continue;

      let imageUrl = ImageSource.getUrl(k)!;
      let brt = await PixiBackend.pixiBackend.getImageFromCanvas(imageUrl);
      ImageSource.setBaseTexture(k, brt);
    }

    console.log(new Date());
    console.log('render done for all');

  }



  async getImageWhite(path: string) {
    console.log('reading ' + path);
    let data: Jimp | null = await Jimp.read(path);
    let width = data.getWidth();
    let height = data.getHeight();

    //let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: width, height: height });
    //let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);
    
    let options = {
      forceCanvas: true,
      preserveDrawingBuffer: true
    }
    let pixiApp = new PIXI.Application(options);

    let brt = new PIXI.BaseRenderTexture({width: width, height: height });
    let rt = new PIXI.RenderTexture(brt);

    let graphics = new PIXI.Graphics();

    let container = new PIXI.Container();
    container.addChild(graphics);

    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++) {
        let color = data.getPixelColor(x, y);
        let colorObject = Jimp.intToRGBA(color);
        let alpha = colorObject.a / 255;
        graphics.beginFill(0xFFFFFF, alpha);
        graphics.drawRect(x, y, 1, 1);
        graphics.endFill();
      }

    pixiApp.renderer.render(container, rt, false);

    // Release memory
    container.destroy({children: true});
    //container = null;
    rt.destroy();
    //rt = null;
    data = null;
    global.gc();

    //console.log('render done for ' + path);
    return brt;
  }

  async getImageFromCanvas(path: string) {
    console.log('loading image from file : ' + path)
    let image = await loadImage(path);
    let ressource = new NodeCanvasResource(image);
    let bt = new PIXI.BaseTexture(ressource);
    /*
    let tImage = PixiPolyfill.pixiPolyfill.getNewTextureWhole(bt);
    let sprite = PixiPolyfill.pixiPolyfill.getNewSprite(tImage);
    let container = PixiPolyfill.pixiPolyfill.getNewContainer();
    container.addChild(sprite);
    sprite.x = 0;
    sprite.y = 0;
    let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: image.width, height: image.height});
    let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);

    PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(container, rt, true);
    */
    return bt;
  }

  async getImage(path: string) {

    let useJsonData = false;
    let writeJsonData = true;

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

    let brt = new PIXI.BaseRenderTexture({width: width, height: height });
    let rt = new PIXI.RenderTexture(brt);

    let graphics = new PIXI.Graphics();

    let container = PIXI.Container();
    container.addChild(graphics);

    let jsonExport: any = {};

    if (writeJsonData) {
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

          let alpha = colorObject.a / 255;

          let color = Jimp.rgbaToInt(colorObject.r, colorObject.g, colorObject.b, colorObject.a);
          color = color >> 8;

          graphics.beginFill(color, alpha);
        }
        else {
          let color = data.getPixelColor(x, y);
          let colorObject = Jimp.intToRGBA(color);

          let alpha = colorObject.a / 255;
          
          if (writeJsonData) {
            jsonExport.data[index] = color; index++;
          }

          color = color >> 8;

          graphics.beginFill(color, alpha);
        }
        

        
        graphics.drawRect(x, y, 1, 1);
        graphics.endFill();
      }

    if (writeJsonData) {
      let jsonExportString = JSON.stringify(jsonExport);
      fs.writeFileSync(path.replace('png', 'json'), jsonExportString);
    }
    
    pixiApp.renderer.render(container, rt, false);

    // Release memory
    container.destroy({children: true});
    container = null;
    rt.destroy();
    //rt = null;
    data = null;
    global.gc();

    //console.log('render done for ' + path);
    return brt;
  }
}