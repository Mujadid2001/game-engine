import { System } from '../core/System.js';
import { Position } from '../components/Position.js';
import { Collider } from '../components/Collider.js';
import { Velocity } from '../components/Velocity.js';
import { RigidBody } from '../components/RigidBody.js';

export class CollisionSystem extends System {
  constructor() {
    super();
    this.collisions = [];
  }

  update(deltaTime) {
    if (!this.enabled) return;

    this.collisions = [];
    const entities = this.queryEntities(Position, Collider);

    // Broad phase: Check all pairs
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];

        const posA = this.getComponent(entityA, Position);
        const collA = this.getComponent(entityA, Collider);
        const posB = this.getComponent(entityB, Position);
        const collB = this.getComponent(entityB, Collider);

        // Check layer masks
        if (!this.shouldCollide(collA, collB)) continue;

        // Narrow phase: Precise collision detection
        const collision = this.checkCollision(posA, collA, posB, collB);
        
        if (collision) {
          this.collisions.push({ entityA, entityB, ...collision });

          // Handle triggers
          if (collA.isTrigger || collB.isTrigger) {
            if (collA.onTriggerEnter) collA.onTriggerEnter(entityB);
            if (collB.onTriggerEnter) collB.onTriggerEnter(entityA);
          } else {
            // Solid collision response
            this.resolveCollision(entityA, entityB, collision);
            
            if (collA.onCollision) collA.onCollision(entityB);
            if (collB.onCollision) collB.onCollision(entityA);
          }
        }
      }
    }
  }

  shouldCollide(colliderA, colliderB) {
    // Check layer masks
    return (colliderA.mask & (1 << colliderB.layer)) !== 0 &&
           (colliderB.mask & (1 << colliderA.layer)) !== 0;
  }

  checkCollision(posA, collA, posB, collB) {
    if (collA.type === 'box' && collB.type === 'box') {
      return this.checkAABB(posA, collA, posB, collB);
    } else if (collA.type === 'circle' && collB.type === 'circle') {
      return this.checkCircle(posA, collA, posB, collB);
    }
    return null;
  }

  checkAABB(posA, collA, posB, collB) {
    const ax = posA.x + collA.offsetX;
    const ay = posA.y + collA.offsetY;
    const bx = posB.x + collB.offsetX;
    const by = posB.y + collB.offsetY;

    const overlapX = (ax + collA.width) - bx;
    const overlapY = (ay + collA.height) - by;
    const overlapX2 = (bx + collB.width) - ax;
    const overlapY2 = (by + collB.height) - ay;

    if (overlapX > 0 && overlapY > 0 && overlapX2 > 0 && overlapY2 > 0) {
      // Calculate penetration depth
      const penetrationX = Math.min(overlapX, overlapX2);
      const penetrationY = Math.min(overlapY, overlapY2);
      
      // Determine collision normal
      let normalX = 0, normalY = 0;
      if (penetrationX < penetrationY) {
        normalX = (overlapX < overlapX2) ? 1 : -1;
      } else {
        normalY = (overlapY < overlapY2) ? 1 : -1;
      }

      return {
        penetration: Math.min(penetrationX, penetrationY),
        normalX,
        normalY
      };
    }
    return null;
  }

  checkCircle(posA, collA, posB, collB) {
    const dx = (posB.x + collB.offsetX) - (posA.x + collA.offsetX);
    const dy = (posB.y + collB.offsetY) - (posA.y + collA.offsetY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radiusSum = (collA.width / 2) + (collB.width / 2);

    if (distance < radiusSum) {
      const penetration = radiusSum - distance;
      return {
        penetration,
        normalX: dx / distance,
        normalY: dy / distance
      };
    }
    return null;
  }

  resolveCollision(entityA, entityB, collision) {
    const posA = this.getComponent(entityA, Position);
    const posB = this.getComponent(entityB, Position);
    const rbA = this.getComponent(entityA, RigidBody);
    const rbB = this.getComponent(entityB, RigidBody);
    const velA = this.getComponent(entityA, Velocity);
    const velB = this.getComponent(entityB, Velocity);

    // Separate objects
    const totalMass = (rbA?.mass || 1) + (rbB?.mass || 1);
    const ratioA = (rbB?.mass || 1) / totalMass;
    const ratioB = (rbA?.mass || 1) / totalMass;

    if (!rbA?.isStatic) {
      posA.x -= collision.normalX * collision.penetration * ratioA;
      posA.y -= collision.normalY * collision.penetration * ratioA;
    }
    if (!rbB?.isStatic) {
      posB.x += collision.normalX * collision.penetration * ratioB;
      posB.y += collision.normalY * collision.penetration * ratioB;
    }

    // Apply collision response (bounce)
    if (velA && velB && rbA && rbB) {
      const restitution = Math.min(rbA.restitution, rbB.restitution);
      const relVelX = velB.x - velA.x;
      const relVelY = velB.y - velA.y;
      const velAlongNormal = relVelX * collision.normalX + relVelY * collision.normalY;

      if (velAlongNormal < 0) return; // Objects moving apart

      const impulse = -(1 + restitution) * velAlongNormal / totalMass;

      if (!rbA.isStatic) {
        velA.x -= impulse * collision.normalX * (rbB.mass || 1);
        velA.y -= impulse * collision.normalY * (rbB.mass || 1);
      }
      if (!rbB.isStatic) {
        velB.x += impulse * collision.normalX * (rbA.mass || 1);
        velB.y += impulse * collision.normalY * (rbA.mass || 1);
      }
    }
  }

  getCollisions() {
    return this.collisions;
  }
}
