// this is all very confusing to me i dont really get it (couldnt write all this from scratch), so if u want to change something, read about it somewhere or watch a vid
// basically in the most simple way - this is the loop that UPDATES the games graphics so its not just an image, it actually animates

// explanation on "let" and "const", for example if something will change 100%, for example like a lvl, its "let", if its something like a name, which will never change, its "const".

// "context" is usually written down as "ctx", stands for context, keep in mind when reading other sources.

// const gameCanvas = document.getElementById("gameCanvas");
const context = gameCanvas.getContext("2d");

let rectX = 100;
let rectY = 100;
const rectW = 500;
const rectH = 400;
const speedX = 120;

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
  // dt = (delta time) seconds since last update // if we want 60 fps (frames per second), then dt should be 1/60 = 0.0166667 seconds, or ~0.16 seconds.
  rectX += speedX * dt; // move to the right over time

  // if the rectangle goes off the right edge of the canvas, reset it to the left edge (0) so it can start moving again. This creates a looping effect where the rectangle continuously moves across the canvas.
  if (rectX + rectW > gameCanvas.width) rectX = 0;
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
