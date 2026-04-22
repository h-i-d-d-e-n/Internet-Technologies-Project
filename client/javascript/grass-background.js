import * as PIXI from "pixi.js";

class GrassBackground {
  constructor(app, grassTexture, treeTexture) {
    this.app = app;
    this.container = new Container();

    this.grassTexture = grassTexture;
    this.treeTexture = treeTexture;

    this.objects = [];
    this.minDistance = 140;

    setTimeout(() => {
      this.spawnObject();
    }, 1000);

    this.scheduleNextSpawn();
  }

  scheduleNextSpawn() {
    const delay = 5000 + Math.random() * 10000; // 5–15 sec

    setTimeout(() => {
      this.spawnObject();
      this.scheduleNextSpawn();
    }, delay);
  }

  spawnObject() {
    const texture = Math.random() < 0.5 ? this.treeTexture : this.grassTexture;
    const sprite = new Sprite(texture);

    sprite.anchor.set(0, 1); // left edge, bottom edge
    sprite.scale.set(1);

    // road level
    sprite.y = this.app.screen.height + 1;

    // fully outside the right side of the canvas
    const lastObject = this.objects[this.objects.length - 1];
    const baseX = this.app.screen.width + 50;

    if (lastObject) {
      sprite.x = Math.max(
        baseX,
        lastObject.x + lastObject.width + this.minDistance,
      );
    } else {
      sprite.x = baseX;
    }

    this.container.addChild(sprite);
    this.objects.push(sprite);

    console.log("Spawned grass/tree at", sprite.x, sprite.y);
  }

  update(speed) {
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      obj.x -= speed;

      if (obj.x < -obj.width - 50) {
        this.container.removeChild(obj);
        this.objects.splice(i, 1);
      }
    }
  }
}

export async function createBackground(app) {
  const [grassTexture, treeTexture] = await Promise.all([
    Assets.load("/assets/grass.png"),
    Assets.load("/assets/tree.png"),
  ]);

  const background = new GrassBackground(app, grassTexture, treeTexture);

  app.stage.addChild(background.container);

  app.ticker.add(() => {
    background.update(0.8);
  });

  return background;
}
