import * as PIXI from "pixi.js";
import { ROAD_BASE_SPEED } from "./floor.js";

export async function createObstacleManager(app) {
  const barrierTexture = await Assets.load("/assets/warning-tape.png");
  const signTexture = await Assets.load("/assets/road-sign.png");

  const obstacles = [];

  let spawnTimer = null;
  let currentSpawnRate = 1800;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getNextSpawnDelay() {
    return randomInRange(currentSpawnRate * 0.75, currentSpawnRate * 1.25);
  }

  // FIXED Y POSITIONS
  const OBSTACLE_Y_POSITIONS = {
    barrier: app.screen.height,
    sign: app.screen.height - 5,
  };

  function scheduleNextSpawn() {
    if (spawnTimer !== null) {
      clearTimeout(spawnTimer);
    }

    spawnTimer = window.setTimeout(() => {
      spawnObstacle();
      scheduleNextSpawn();
    }, getNextSpawnDelay());
  }

  function spawnObstacle() {
    const type = Math.random() < 0.5 ? "barrier" : "sign";

    const texture = type === "barrier" ? barrierTexture : signTexture;

    const sprite = new Sprite(texture);

    sprite.anchor.set(0.5, 1);

    // spawn off screen
    sprite.x = app.screen.width + randomInRange(80, 220);

    // vertical placement
    sprite.y = OBSTACLE_Y_POSITIONS[type];

    /* -------------------------
       HITBOX (NEW)
    ------------------------- */

    sprite.hitbox =
      type === "barrier"
        ? { width: 70, height: 70, offsetX: 0, offsetY: 0 }
        : { width: 28, height: 85, offsetX: 0, offsetY: 0 };

    app.stage.addChild(sprite);

    obstacles.push(sprite);
  }

  function update(speedMultiplier = 1) {
    const speed = ROAD_BASE_SPEED * speedMultiplier;

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i];

      obstacle.x -= speed;

      if (obstacle.x < -200) {
        app.stage.removeChild(obstacle);
        obstacles.splice(i, 1);
      }
    }
  }

  function startSpawning(spawnRate) {
    currentSpawnRate = spawnRate;
    scheduleNextSpawn();
  }

  function setSpawnRate(spawnRate) {
    currentSpawnRate = spawnRate;

    if (spawnTimer !== null) {
      scheduleNextSpawn();
    }
  }

  function stopSpawning() {
    if (spawnTimer !== null) {
      clearTimeout(spawnTimer);
      spawnTimer = null;
    }
  }

  function getObstacles() {
    return obstacles;
  }

  return {
    spawnObstacle,
    startSpawning,
    setSpawnRate,
    stopSpawning,
    update,
    getObstacles,
  };
}
