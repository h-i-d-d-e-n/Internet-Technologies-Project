export const input = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  crouch: false,
};

window.addEventListener("keydown", (e) => {
  if (e.code === "KeyA") input.left = true;
  if (e.code === "KeyD") input.right = true;
  if (e.code === "KeyW") input.up = true;
  if (e.code === "KeyS") input.down = true;
  if (e.code === "Space") input.jump = true;
  if (e.code === "ControlLeft") input.crouch = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyA") input.left = false;
  if (e.code === "KeyD") input.right = false;
  if (e.code === "KeyW") input.up = false;
  if (e.code === "KeyS") input.down = false;
  if (e.code === "Space") input.jump = false;
  if (e.code === "ControlLeft") input.crouch = false;
});
