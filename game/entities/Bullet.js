import { Prefab } from '../../engine/scene/Prefab.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { Collider } from '../../engine/components/Collider.js';

export function createBullet(x, y, velocityX, velocityY) {
  return new Prefab('Bullet', [
    new Position(x, y),
    new Velocity(velocityX, velocityY),
    new Sprite('./game/assets/player.png', 8, 8),
    new Collider(8, 8)
  ]);
}
