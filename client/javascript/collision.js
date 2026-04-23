import { Assets } from "pixi.js";

export function checkCollision(a, b) {
  const aLeft = a.x - a.hitbox.width / 2 + a.hitbox.offsetX;
  const aRight = aLeft + a.hitbox.width;
  const aTop = a.y - a.hitbox.height + a.hitbox.offsetY;
  const aBottom = aTop + a.hitbox.height;

  const bLeft = b.x - b.hitbox.width / 2 + b.hitbox.offsetX;
  const bRight = bLeft + b.hitbox.width;
  const bTop = b.y - b.hitbox.height + b.hitbox.offsetY;
  const bBottom = bTop + b.hitbox.height;

  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}
