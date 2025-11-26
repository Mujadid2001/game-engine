import { System } from '../core/System.js';
import { Position } from '../components/Position.js';
import { Collider } from '../components/Collider.js';
import { Query } from '../core/Query.js';

export class CollisionSystem extends System {
  constructor(componentManager, entityManager) {
    super();
    this.query = new Query(componentManager, entityManager);
    this.componentManager = componentManager;
  }

  update(deltaTime) {
    const entities = this.query.getEntitiesWithComponents(Position, Collider);

    // Simple AABB collision detection
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];

        const posA = this.componentManager.getComponent(entityA, Position);
        const posB = this.componentManager.getComponent(entityB, Position);
        const colA = this.componentManager.getComponent(entityA, Collider);
        const colB = this.componentManager.getComponent(entityB, Collider);

        if (this.checkAABB(posA, colA, posB, colB)) {
          // Collision detected - emit event or handle collision
          console.log(`Collision between ${entityA} and ${entityB}`);
        }
      }
    }
  }

  checkAABB(posA, colA, posB, colB) {
    return (
      posA.x + colA.offsetX < posB.x + colB.offsetX + colB.width &&
      posA.x + colA.offsetX + colA.width > posB.x + colB.offsetX &&
      posA.y + colA.offsetY < posB.y + colB.offsetY + colB.height &&
      posA.y + colA.offsetY + colA.height > posB.y + colB.offsetY
    );
  }
}
