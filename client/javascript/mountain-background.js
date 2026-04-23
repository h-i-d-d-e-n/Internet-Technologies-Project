import { Assets, Container, Sprite } from "pixi.js";

class MountainBackground {
  constructor(app, texture) {
    this.app = app;
    this.container = new Container();
    this.texture = texture;
    this.mountains = [];

    this.scheduleNextSpawn();
  }

  scheduleNextSpawn() {
    const delay = 30000 + Math.random() * 15000; // 30–45 sec

    setTimeout(() => {
      this.spawnMountain();
      this.scheduleNextSpawn();
    }, delay);
  }

  spawnMountain() {
    const sprite = new Sprite(this.texture);

    sprite.anchor.set(0, 1);

    // a little above buildings/floor line
    sprite.y = this.app.screen.height;
    sprite.x = this.app.screen.width + 50;

    this.container.addChild(sprite);
    this.mountains.push(sprite);

    console.log("Spawned mountain at", sprite.x, sprite.y);
  }

  update(speed) {
    for (let i = this.mountains.length - 1; i >= 0; i--) {
      const mountain = this.mountains[i];
      mountain.x -= speed * 0.3;

      if (mountain.x < -mountain.width - 50) {
        this.container.removeChild(mountain);
        this.mountains.splice(i, 1);
      }
    }
  }
}

export async function createMountainBackground(app) {
  const texture = await Assets.load("/client/assets/mountain.png");

  const background = new MountainBackground(app, texture);
  app.stage.addChild(background.container);

  app.ticker.add(() => {
    background.update(0.8);
  });

  return background;
}
