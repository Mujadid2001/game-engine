import { Prefab } from '../../engine/scene/Prefab.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { Collider } from '../../engine/components/Collider.js';
import { RigidBody } from '../../engine/components/RigidBody.js';

export function createEnemy(x, y) {
  return new Prefab('Enemy', [
    new Position(x, y),
    new Velocity(-50, 0),
    new Sprite('./game/assets/enemy.png', 32, 32),
    new Collider(32, 32),
    new RigidBody(1, 980)
  ]);
}
