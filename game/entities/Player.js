import { Prefab } from '../../engine/scene/Prefab.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { Collider } from '../../engine/components/Collider.js';
import { RigidBody } from '../../engine/components/RigidBody.js';
import { PlayerInput } from '../../engine/components/PlayerInput.js';

export function createPlayer(x, y) {
  return new Prefab('Player', [
    new Position(x, y),
    new Velocity(0, 0),
    new Sprite('./game/assets/player.png', 32, 32),
    new Collider(32, 32),
    new RigidBody(1, 980),
    new PlayerInput()
  ]);
}
