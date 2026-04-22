import * as PIXI from "pixi.js";

export async function createBuildings(app) {
  const texture = await Assets.load("/assets/double-glass.png");
  const speed = 0.2;
  const buildings = [];

  const building = new Sprite(texture);
  building.x = 0;
  building.y = app.screen.height - texture.height - 80;

  app.stage.addChild(building);
  buildings.push(building);

  app.ticker.add(() => {
    for (const b of buildings) {
      b.x -= speed;

      if (b.x + b.width < 0) {
        b.x = app.screen.width;
      }
    }
  });
}
