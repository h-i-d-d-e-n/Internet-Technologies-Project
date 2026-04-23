import { Assets, Sprite } from "pixi.js";

export async function createClouds(app) {
  const texture = await Assets.load("/assets/cloud.png");

  const speed = 0.1;
  const clouds = [];

  const minY = 20;
  const maxY = 140;

  for (let i = 0; i < 5; i++) {
    const cloud = new Sprite(texture);

    cloud.x = i * 250 + Math.random() * 100;
    cloud.y = minY + Math.random() * (maxY - minY);

    app.stage.addChild(cloud);
    clouds.push(cloud);
  }

  app.ticker.add(() => {
    for (const cloud of clouds) {
      cloud.x -= speed;
    }

    for (const cloud of clouds) {
      if (cloud.x + cloud.width < 0) {
        const rightMost = Math.max(...clouds.map((c) => c.x + c.width));
        const gap = 120 + Math.random() * 180;

        cloud.x = rightMost + gap;
        cloud.y = minY + Math.random() * (maxY - minY);
      }
    }
  });
}
