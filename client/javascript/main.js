import { Application } from "pixi.js";
import { createPlayer } from "./player.js";
import { createFloor } from "./floor.js";
import { createClouds } from "./clouds.js";
import { createBuildings } from "./buildings.js";
import { createBackground } from "./grass-background.js";
import { createMountainBackground } from "./mountain-background.js";

const app = new Application();

async function startGame() {
  const gameContainer = document.getElementById("game-container");
  const fullscreenButton = document.getElementById("fullscreen-btn");

  if (!gameContainer) {
    console.error("Missing #game-container in HTML");
    return;
  }

  await app.init({
    width: 900,
    height: 500,
    backgroundColor: 0x9bd2ff,
  });

  gameContainer.appendChild(app.canvas);

  await createClouds(app);
  createMountainBackground(app);
  createBackground(app);
  await createBuildings(app);
  await createFloor(app);

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        app.canvas.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
}

startGame().catch((err) => {
  console.error("Pixi failed to start:", err);
});
