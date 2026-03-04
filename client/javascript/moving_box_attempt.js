const gameCanvas = document.getElementById("gameCanvas");
const context = gameCanvas.getContext("2d");

let rectX = 100;
let rectY = 100;
const rectW = 200;
const rectH = 180;
let speedX = 0;
let speedY = 0;

const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});

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

let lastTime = performance.now(); //  this line means that we are getting the current time in milliseconds since the page loaded, and storing it in the variable "lastTime". This is used to calculate the time difference (delta time) between frames, which is important for smooth animation. By using "performance.now()", we get a high-resolution timestamp that is more accurate than "Date.now()".

function loop(now) {
  const dt = (now - lastTime) / 1000; // 1000ms - 1s
  lastTime = now;

  update(dt);
  draw();

  requestAnimationFrame(loop); // schedule next frame
}

requestAnimationFrame(loop);
