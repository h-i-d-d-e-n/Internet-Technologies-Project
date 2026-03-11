import { Assets, Sprite } from "pixi.js";

export async function createFloor(app) {
  const texture = await Assets.load("/assets/road-loop.png");

  const segmentWidth = texture.width;
  const speed = 0.8;
  const floors = [];

  for (let i = 0; i < 3; i++) {
    const floor = new Sprite(texture);
    floor.y = app.screen.height - texture.height;
    floor.x = i * segmentWidth;

    app.stage.addChild(floor);
    floors.push(floor);
  }

  app.ticker.add(() => {
    for (const floor of floors) {
      floor.x -= speed;
    }

    for (const floor of floors) {
      if (floor.x + segmentWidth < 0) {
        const rightMost = Math.max(...floors.map((f) => f.x));
        floor.x = rightMost + segmentWidth;
      }
    }
  });
}
