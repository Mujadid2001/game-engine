import { System } from '../core/System.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';

export class MovementSystem extends System {
  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Position, Velocity);

    for (const entity of entities) {
      const position = this.getComponent(entity, Position);
      const velocity = this.getComponent(entity, Velocity);

      // Update position based on velocity
      position.x += velocity.x * deltaTime;
      position.y += velocity.y * deltaTime;

      // Apply velocity constraints if they exist
      if (velocity.maxSpeed !== undefined) {
        const speed = Math.hypot(velocity.x, velocity.y);
        if (speed > velocity.maxSpeed) {
          const factor = velocity.maxSpeed / speed;
          velocity.x *= factor;
          velocity.y *= factor;
        }
      }
    }
  }
}
