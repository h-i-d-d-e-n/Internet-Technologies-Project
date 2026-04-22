// this is all very confusing to me i dont really get it (couldnt write all this from scratch), so if u want to change something, read about it somewhere or watch a vid
// basically in the most simple way - this is the loop that UPDATES the games graphics so its not just an image, it actually animates

// explanation on "let" and "const", for example if something will change 100%, for example like a lvl, its "let", if its something like a name, which will never change, its "const".

// "context" is usually written down as "ctx", stands for context, keep in mind when reading other sources.

// const gameCanvas = document.getElementById("gameCanvas");
import * as PIXI from "pixi.js";
import { keys } from "../client/javascript/input.js";

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});

document.getElementById("game-container").appendChild(app.view);

let rectX = 100;
let rectY = 100;
const rectW = 200;
const rectH = 180;
let speedX = 0;
let speedY = 0;

function draw() {
  // clear canvas
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // draw border
  context.strokeStyle = "black";
  context.lineWidth = 2; // its on 2 because the stroke is drawn centered on the edge of the rectangle, so 1px is inside and 1px is outside, if it was 1, then half of it would be outside the canvas and not visible
  context.strokeRect(1, 1, gameCanvas.width - 2, gameCanvas.height - 2); // draws the border INSIDE the canvas, not like the css version.

  // draw rectangle
  context.fillStyle = "red";
  context.fillRect(rectX, rectY, rectW, rectH);
}

function frame_count(dt) {
  const fps = 1 / dt;
  context.fillStyle = "black";
  context.fillText("FPS: " + Math.round(fps), 20, 30);
}

function update(dt) {
  let dx = 0; // d - delta, x - x axis   if dx is -1, move left cause x = -1 go left
  let dy = 0; // d - delta, y - y axis

  if (keys["KeyA"]) dx -= 1;
  if (keys["KeyD"]) dx += 1;
  if (keys["KeyW"]) dy -= 1;
  if (keys["KeyS"]) dy += 1;

  // normalize diagonal movement (a little complex, but specific formula)
  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.sqrt(2); // ≈ 0.7071
    dx *= inv;
    dy *= inv;
  }

  const speed = 500;

  rectX += dx * speed * dt;
  rectY += dy * speed * dt;

  // right collision
  // this formula is here cause the box can skip past the barrier
  if (rectX + rectW > gameCanvas.width) {
    rectX = gameCanvas.width - rectW; // reset back
  }

  // left collision
  if (rectX < 0) {
    rectX = 0;
  }

  // top collision
  if (rectY < 0) {
    rectY = 0;
  }

  // bottom collision
  if (rectY + rectH > gameCanvas.height) {
    rectY = gameCanvas.height - rectH;
  }

  // im not going to add speed dif when against a wall yet, not needed
}

app.ticker.add((delta) => {
  update(delta / 60);
});

requestAnimationFrame(loop);
