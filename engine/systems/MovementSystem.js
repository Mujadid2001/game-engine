import { System } from '../core/System.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Query } from '../core/Query.js';

export class MovementSystem extends System {
  constructor(componentManager, entityManager) {
    super();
    this.query = new Query(componentManager, entityManager);
    this.componentManager = componentManager;
  }

  update(deltaTime) {
    const entities = this.query.getEntitiesWithComponents(Position, Velocity);

    for (const entity of entities) {
      const position = this.componentManager.getComponent(entity, Position);
      const velocity = this.componentManager.getComponent(entity, Velocity);

      position.x += velocity.x * deltaTime;
      position.y += velocity.y * deltaTime;
    }
  }
}
