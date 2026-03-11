import { AnimatedSprite, Assets } from "pixi.js";

export async function createPlayer(app) {
  const sheet = await Assets.load("/assets/project-player-temp.json");

  const frames = Object.keys(sheet.textures)
    .sort()
    .map((key) => sheet.textures[key]);

  const player = new AnimatedSprite(frames);

  player.anchor.set(0.5, 1);

  player.x = 150;
  player.y = app.screen.height - 60;

  player.animationSpeed = 0.15;
  player.play();

  app.stage.addChild(player);

  return {
    sprite: player,
    update() {},
  };
}
