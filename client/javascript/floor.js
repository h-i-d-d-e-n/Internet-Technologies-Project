import * as PIXI from "pixi.js";

export const ROAD_BASE_SPEED = 0.8;

export async function createFloor(app) {
  const texture = await Assets.load("/assets/road-loop.png");

  const segmentWidth = texture.width;
  const floors = [];

  for (let i = 0; i < 3; i++) {
    const floor = new Sprite(texture);

    floor.y = app.screen.height - texture.height;
    floor.x = i * segmentWidth;

    app.stage.addChild(floor);
    floors.push(floor);
  }

  function update(multiplier = 1) {
    const speed = ROAD_BASE_SPEED * multiplier;

    for (const floor of floors) {
      floor.x -= speed;
    }

    for (const floor of floors) {
      if (floor.x + segmentWidth < 0) {
        const rightMost = Math.max(...floors.map((f) => f.x));
        floor.x = rightMost + segmentWidth;
      }
    }
  }

  return { update };
}
