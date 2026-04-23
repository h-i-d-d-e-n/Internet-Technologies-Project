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
  easy: {
    speedMultiplier: 0.8,
    spawnRate: 2500,
  },
  medium: {
    speedMultiplier: 1,
    spawnRate: 1800,
  },
  hard: {
    speedMultiplier: 1.3,
    spawnRate: 1200,
  },
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
  scoreDisplay.style.pointerEvents = "none";

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

  /* -------------------------
     DEATH EFFECT
  ------------------------- */

  function triggerDeath() {
    const overlay = document.createElement("div");

    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";

    overlay.style.background = "rgba(255,0,0,0.3)";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "background 2s";

    gameContainer.appendChild(overlay);

    const loading_text = document.createElement("div");

    loading_text.innerText = "loading...";
    loading_text.style.position = "absolute";
    loading_text.style.left = "50%";
    loading_text.style.top = "50%";
    loading_text.style.transform = "translate(-50%, -50%)";
    loading_text.style.fontSize = "24px";
    loading_text.style.color = "white";
    loading_text.style.opacity = "0";
    loading_text.style.transition = "opacity 2s";

    overlay.appendChild(loading_text);

    setTimeout(() => {
      loading_text.style.opacity = "1";
    }, 500);

    setTimeout(() => {
      overlay.style.background = "black";
    }, 2000);

    setTimeout(() => {
      location.reload();
    }, 4000);
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
    if (gameStarted && obstacleManager) {
      obstacleManager.setSpawnRate(currentDifficulty.spawnRate);
    }
  });

  mediumHitbox.addEventListener("click", () => {
    selectedDifficulty = "medium";
    currentDifficulty = DifficultySettings.medium;
    if (gameStarted && obstacleManager) {
      obstacleManager.setSpawnRate(currentDifficulty.spawnRate);
    }
  });

  hardHitbox.addEventListener("click", () => {
    selectedDifficulty = "hard";
    currentDifficulty = DifficultySettings.hard;
    if (gameStarted && obstacleManager) {
      obstacleManager.setSpawnRate(currentDifficulty.spawnRate);
    }
  });

  /* -------------------------
     PLAY BUTTON
  ------------------------- */

  playHitbox.addEventListener("click", () => {
    if (gameStarted) return;

    gameStarted = true;

    playBtn.style.display = "none";
    difficultyBtn.style.display = "none";

    document.getElementById("vignette").style.opacity = "0.5";
    document.getElementById("blur-overlay").style.opacity = "0";
    document.getElementById("fade-overlay").style.opacity = "0";

    // START SCORE
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
     FULLSCREEN
  ------------------------- */

  function resizeGame() {
    const baseWidth = 900;
    const baseHeight = 500;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scale = Math.min(screenWidth / baseWidth, screenHeight / baseHeight);

    const newWidth = baseWidth * scale;
    const newHeight = baseHeight * scale;

    app.renderer.resize(newWidth, newHeight);

    app.canvas.style.position = "absolute";
    app.canvas.style.left = `${(screenWidth - newWidth) / 2}px`;
    app.canvas.style.top = `${(screenHeight - newHeight) / 2}px`;
  }

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      resizeGame();
    } else {
      app.renderer.resize(900, 500);
      app.canvas.style = "";
    }
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

  const clouds = await createClouds(app);
  createMountainBackground(app);
  createBackground(app);
  const buildings = await createBuildings(app);
  const floor = await createFloor(app);
  obstacleManager = await createObstacleManager(app);

  const player = await createPlayer(app);

  /* -------------------------
     GAME LOOP
  ------------------------- */

  app.ticker.add(() => {
    if (!gameStarted) return;

    if (!gameOver) {
      floor.update(currentDifficulty.speedMultiplier);
      obstacleManager.update(currentDifficulty.speedMultiplier);

      if (input.left) player.sprite.x -= 0.1;
      if (input.right) player.sprite.x += 0.1;

      player.update(input);

      const obstacles = obstacleManager.getObstacles();

      for (const obstacle of obstacles) {
        if (checkCollision(player.sprite, obstacle)) {
          gameOver = true;

          app.ticker.stop();

          clearInterval(scoreInterval);

          triggerDeath();
        }
      }

      if (player.sprite.x < 50) player.sprite.x = 50;
      if (player.sprite.x > app.screen.width - 50)
        player.sprite.x = app.screen.width - 50;
    }
  });
}

startGame().catch((err) => {
  console.error("Pixi failed to start:", err);
});
