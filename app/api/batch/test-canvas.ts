import { PixiPolyfill, NodeCanvasResource } from "../../../../blueprintnotincluded-lib";
import * as fs from 'fs';
require('../../pixi-shim/lib/node/canvas.js')

const { createCanvas, loadImage } = require('canvas')



export class TestCanvas
{
  constructor() {

    console.log('test canvas')
    this.testCanvas();
  }

  async testCanvas() {
    let image = await loadImage('./assets/images/SweepBotStation_group_sprite.png');
    let canvas = createCanvas(image.width, image.height) //document.createElement('canvas');
    canvas.width = image.width
    canvas.height = image.height
    let ressource = new NodeCanvasResource(image);
    //canvas.__proto__ = HTMLCanvasElement.prototype
    console.log(canvas instanceof HTMLCanvasElement)
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0)
    let btImage = PixiPolyfill.pixiPolyfill.getNewBaseTextureFromCanvas(ressource);
    let tImage = PixiPolyfill.pixiPolyfill.getNewTextureWhole(btImage);
    let sprite = PixiPolyfill.pixiPolyfill.getNewSprite(tImage);
    let container = PixiPolyfill.pixiPolyfill.getNewContainer();
    container.addChild(sprite);
    sprite.x = 0;
    sprite.y = 0;
    sprite.alpha = 0.5;
    sprite.tint = 0xFF00FF;
    let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: image.width, height: image.height});
    let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);

    PixiPolyfill.pixiPolyfill.pixiApp.renderer.render(container, rt, true);
    let base64: string = PixiPolyfill.pixiPolyfill.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL();
    console.log(base64);
  }
}

new TestCanvas()