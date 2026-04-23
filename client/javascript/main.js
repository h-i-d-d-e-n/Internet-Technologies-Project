// WORLD SETTINGS
import { Application } from "pixi.js";
import { createPlayer } from "./player.js";
import { createStateManager } from "./state-manager.js";
import { input } from "./input.js";
import { checkCollision } from "./collision.js";

// ASSETS
import { createFloor } from "./floor.js";
import { createClouds } from "./clouds.js";
import { createBuildings } from "./buildings.js";
import { createBackground } from "./grass-background.js";
import { createMountainBackground } from "./mountain-background.js";
import { createObstacleManager } from "./obstacles.js";

const stateManager = createStateManager();

/* -------------------------
   DIFFICULTY SETTINGS
------------------------- */

const DifficultySettings = {
  easy: { speedMultiplier: 0.8, spawnRate: 2500 },
  medium: { speedMultiplier: 1, spawnRate: 1800 },
  hard: { speedMultiplier: 1.3, spawnRate: 1200 },
};

let selectedDifficulty = "medium";
let currentDifficulty = DifficultySettings.medium;

async function startGame() {
  const gameContainer = document.getElementById("game-container");
  const fullscreenButton = document.getElementById("fullscreen-btn");

  if (!gameContainer) {
    console.error("Missing #game-container in HTML");
    return;
  }

  const app = new Application({
    width: 900,
    height: 500,
    backgroundColor: 0x9bd2ff,
  });

  gameContainer.appendChild(app.view);

  /* -------------------------
     SCORE SYSTEM
  ------------------------- */

  let score = 0;
  let scoreInterval = null;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "10px";
  scoreDisplay.style.left = "50%";
  scoreDisplay.style.transform = "translateX(-50%)";
  scoreDisplay.style.color = "white";
  scoreDisplay.style.fontSize = "24px";
  scoreDisplay.style.fontFamily = "monospace";
  scoreDisplay.innerText = "Score: 0";

  gameContainer.appendChild(scoreDisplay);

  /* -------------------------
     MENU
  ------------------------- */

  const playBtn = document.getElementById("play-btn");
  const difficultyBtn = document.getElementById("difficulty-btn");

  const playHitbox = document.querySelector(".play-hitbox");
  const easyHitbox = document.querySelector(".difficulty-hitbox-easy");
  const mediumHitbox = document.querySelector(".difficulty-hitbox-medium");
  const hardHitbox = document.querySelector(".difficulty-hitbox-hard");

  let gameStarted = false;
  let obstacleManager = null;
  let gameOver = false;

  function triggerDeath() {
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(255,0,0,0.3)";
    overlay.style.transition = "background 2s";

    gameContainer.appendChild(overlay);

    setTimeout(() => (overlay.style.background = "black"), 2000);
    setTimeout(() => location.reload(), 4000);
  }

  setTimeout(() => {
    playBtn.classList.add("active");
    difficultyBtn.classList.add("active");
  }, 600);

  /* -------------------------
     DIFFICULTY BUTTONS
  ------------------------- */

  easyHitbox.addEventListener("click", () => {
    selectedDifficulty = "easy";
    currentDifficulty = DifficultySettings.easy;
  });

  mediumHitbox.addEventListener("click", () => {
    selectedDifficulty = "medium";
    currentDifficulty = DifficultySettings.medium;
  });

  hardHitbox.addEventListener("click", () => {
    selectedDifficulty = "hard";
    currentDifficulty = DifficultySettings.hard;
  });

  /* -------------------------
     PLAY BUTTON
  ------------------------- */

  playHitbox.addEventListener("click", () => {
    if (gameStarted) return;

    gameStarted = true;

    playBtn.style.display = "none";
    difficultyBtn.style.display = "none";

    scoreInterval = setInterval(() => {
      if (!gameOver) {
        score++;
        scoreDisplay.innerText = "Score: " + score;
      }
    }, 1000);

    if (obstacleManager) {
      obstacleManager.startSpawning(currentDifficulty.spawnRate);
    }
  });

  /* -------------------------
   FULLSCREEN (SAFE SCALE)
------------------------- */

function resizeGame() {
  const baseWidth = 900;
  const baseHeight = 500;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const scaleX = screenWidth / baseWidth;
  const scaleY = screenHeight / baseHeight;

  // stretch to fill screen (no black bars)
  app.view.style.width = `${baseWidth * scaleX}px`;
  app.view.style.height = `${baseHeight * scaleY}px`;

  app.view.style.position = "absolute";
  app.view.style.left = "0px";
  app.view.style.top = "0px";
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    resizeGame();
  } else {
    // reset
    app.view.style.width = "900px";
    app.view.style.height = "500px";
    app.view.style.position = "";
    app.view.style.left = "";
    app.view.style.top = "";
  }
});

window.addEventListener("resize", () => {
  if (document.fullscreenElement) resizeGame();
});

if (fullscreenButton) {
  fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
}

  /* -------------------------
     GAME WORLD
  ------------------------- */

  await createClouds(app);
  createMountainBackground(app);
  createBackground(app);
  await createBuildings(app);
  const floor = await createFloor(app);
  obstacleManager = await createObstacleManager(app);
  const player = await createPlayer(app);

  /* -------------------------
     GAME LOOP
  ------------------------- */

  app.ticker.add(() => {
    if (!gameStarted || gameOver) return;

    floor.update(currentDifficulty.speedMultiplier);
    obstacleManager.update(currentDifficulty.speedMultiplier);

    if (input.left) player.sprite.x -= 0.1;
    if (input.right) player.sprite.x += 0.1;

    player.update(input);

    for (const obstacle of obstacleManager.getObstacles()) {
      if (checkCollision(player.sprite, obstacle)) {
        gameOver = true;
        app.ticker.stop();
        clearInterval(scoreInterval);
        triggerDeath();
      }
    }
  });
}

startGame().catch((err) => {
  console.error("Pixi failed to start:", err);
});
