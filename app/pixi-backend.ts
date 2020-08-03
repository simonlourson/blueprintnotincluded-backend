import { Blueprint, Vector2, CameraService, Overlay, Display } from '../../blueprintnotincluded-lib';
import { PixiPolyfill } from '../../blueprintnotincluded-lib/src/drawing/pixi-polyfill';
var PIXI = require('../../blueprintnotincluded-lib/src/pixi-polyfill')

export class PixiBackend
{

  public static pixiBackend: PixiBackend = new PixiBackend();
  //pixiApp: PIXI.Application

  constructor() {
    //this.pixiApp = PixiPolyfill.pixiPolyfill.pixiApp;
  }

  private bunny: PIXI.Sprite

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

    let exportCamera = new CameraService();
    exportCamera.setHardZoom(thumbnailTileSize);
    exportCamera.cameraOffset = cameraOffset;
    exportCamera.overlay = Overlay.Base;
    exportCamera.display = Display.solid;
    
    exportCamera.container = PixiPolyfill.pixiPolyfill.getNewContainer();
    exportCamera.container.sortableChildren = true;

    let graphics = PixiPolyfill.pixiPolyfill.getNewGraphics()
    exportCamera.container.addChild(graphics);

    //graphics.beginFill(0xffffff);
    //graphics.drawRect(0, 0, 200, 200);
    //graphics.endFill();

    angularBlueprint.blueprintItems.map((item) => { 
      item.updateTileables(angularBlueprint);
      item.drawPixi(exportCamera);
    });


    const app = new PIXI.Application({ forceCanvas:true, preserveDrawingBuffer: true });
    console.log({ "PIXI.Application": !!app });
    console.log({ canvas: app.view });
    //if (this.bunny == undefined) this.bunny = PIXI.Sprite.from('bunny.png');
    //let bunnySrc = "https://pixijs.io/examples/examples/assets/bunny.png";
    let bunnySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAlCAYAAABcZvm2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWNJREFUeNrsV8sNwjAMbUqBBWACxB2pQ8AKcGALTsAJuDEFB1gBhuDAuWICmICPQh01pXWdJqEFcaglRGRbfonjPLuMc+5QwhjLGEJfZusjxZOL9akZKye9G98vPMfvsAx4qBfKwfzBL9s6uUHpI6U/u7+BKGkNb/H6umtk7MczF0HyfKS4zo/k/4AgTV8DOizrqX8oECgC+MGa8lGJp9sJDiAB8nyqYoglvJOPbP97IqoATGxWVZeXJlMQwYHA3piF8wJIblOVNBBxe3TPMLoHIKtxrbS7AAbBrA4Y5NaPAXf8LjN6wKZ0RaZOnlAFZnuXInVR4FTE6eYp0olPhhshtXsAwY3PquoAJNkIY33U7HTs7hYBwV24ItUKqDwgKF3VzAZ6k8HF+B1BMF8xRJbeJoqMXHZAAQ1kwoluURCdzepEugGEImBrIADB7I4lyfbJLlw92FKE6b5hVd+ktv4vAQYASMWxvlAAvcsAAAAASUVORK5CYII=";
    let bunnyImage = document.createElement('img');
    console.log({ bunnyImage, context: app.view.getContext('2d') });
    bunnyImage.src = bunnySrc;

    if (this.bunny == undefined) this.bunny = PIXI.Sprite.from(bunnySrc);

    const { width, height } = this.bunny

    console.log({ 'sprite dimensions': { width, height } })
    console.log({ "PIXI.Sprite.from": !!this.bunny });

    /*
    this.bunny.anchor.set(0.5);
    this.bunny.x = 50;
    this.bunny.y = 50;
    */
    app.stage.addChild(this.bunny);
    app.render();
    const base64 = app.view.toDataURL("image/png", 1);
    console.log({
      base64,
      toDataURL: base64 !== "data:,"
    });
    //console.log(this.bunny.texture.baseTexture)

    let brt = PixiPolyfill.pixiPolyfill.getNewBaseRenderTexture({width: thumbnailSize, height: thumbnailSize });
    let rt = PixiPolyfill.pixiPolyfill.getNewRenderTexture(brt);

    this.pixiApp.renderer.render(this.pixiApp.stage, rt, false);
    console.log(this.pixiApp.renderer.plugins.extract.canvas(rt).toDataURL());
    /*
    this.pixiApp.renderer.plugins.extract.canvas(rt).toBlob((blob) => { 
      console.log(blob)
      
      let reader = new window.FileReader();
      reader.onload = () => { console.log(reader.result as string);  };
      reader.readAsDataURL(blob!);
    }); 
    */
  }
}