import { System } from '../core/System.js';
import { RigidBody } from '../components/RigidBody.js';
import { Velocity } from '../components/Velocity.js';
import { Query } from '../core/Query.js';

export class PhysicsSystem extends System {
  constructor(componentManager, entityManager) {
    super();
    this.query = new Query(componentManager, entityManager);
    this.componentManager = componentManager;
  }

  update(deltaTime) {
    const entities = this.query.getEntitiesWithComponents(RigidBody, Velocity);

    for (const entity of entities) {
      const rigidBody = this.componentManager.getComponent(entity, RigidBody);
      const velocity = this.componentManager.getComponent(entity, Velocity);

      if (!rigidBody.isStatic && rigidBody.gravity !== 0) {
        velocity.y += rigidBody.gravity * deltaTime;
      }
    }
  }
}
