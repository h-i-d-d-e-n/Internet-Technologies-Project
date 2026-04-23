import { AnimatedSprite, Rectangle, Texture, Assets } from "pixi.js";

export async function createPlayer(app) {
  const response = await fetch("/assets/project-player-temp.json");
  const data = await response.json();

  const atlas = await Assets.load("/assets/" + data.meta.image);

  const frames = Object.keys(data.frames)
    .sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)?.[0] ?? "0", 10);
      const bNum = parseInt(b.match(/\d+/)?.[0] ?? "0", 10);
      return aNum - bNum;
    })
    .map((key) => {
      const f = data.frames[key].frame;

      return new Texture({
        source: atlas.source,
        frame: new Rectangle(f.x, f.y, f.w, f.h),
      });
    });

  const player = new AnimatedSprite(frames);

  player.anchor.set(0.5, 1);
  player.x = 150;

  player.hitbox = {
    width: 40,
    height: 60,
    offsetX: 0,
    offsetY: -5,
  };

  const groundY = app.screen.height - 50;
  player.y = groundY;

  player.animationSpeed = 0.15;
  player.play();

  app.stage.addChild(player);

  /*
  ============================
  TUNABLE SETTINGS
  ============================
  */

  const BASE_MOVE_SPEED = 0.1; // default movement
  const HOLD_ACCEL = 0.05; // acceleration per frame
  const MAX_SPEED = 2; // speed cap

  const AIR_CONTROL = 0.8;

  const GRAVITY = 0.2;
  const JUMP_FORCE = -10;

  /*
  ============================
  STATE
  ============================
  */

  let velocityY = 0;
  let moveSpeed = BASE_MOVE_SPEED;

  let isGrounded = true;

  return {
    sprite: player,

    update(input) {
      /*
      ============================
      MOVEMENT ACCELERATION
      ============================
      */

      if (input.left || input.right) {
        moveSpeed += HOLD_ACCEL;
        if (moveSpeed > MAX_SPEED) moveSpeed = MAX_SPEED;
      } else {
        moveSpeed = BASE_MOVE_SPEED;
      }

      const control = isGrounded ? 1 : AIR_CONTROL;
      const speed = moveSpeed * control;

      if (input.left) player.x -= speed;
      if (input.right) player.x += speed;

      /*
      ============================
      JUMP
      ============================
      */

      if ((input.jump || input.up) && isGrounded) {
        velocityY = JUMP_FORCE;
        isGrounded = false;
      }

      /*
      ============================
      GRAVITY
      ============================
      */

      velocityY += GRAVITY;
      player.y += velocityY;

      /*
      ============================
      GROUND COLLISION
      ============================
      */

      if (player.y >= groundY) {
        player.y = groundY;
        velocityY = 0;
        isGrounded = true;
      }
    },
  };
}
