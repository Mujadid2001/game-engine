import { System } from '../core/System.js';
import { Health } from '../components/Health.js';

export class HealthSystem extends System {
  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Health);

    for (const entity of entities) {
      const health = this.getComponent(entity, Health);

      // Regeneration
      if (health.regeneration > 0 && health.currentHealth < health.maxHealth) {
        health.heal(health.regeneration * deltaTime);
      }

      // Invulnerability timer
      if (health.invulnerabilityTime > 0) {
        health.invulnerabilityTime -= deltaTime;
        health.invulnerable = health.invulnerabilityTime > 0;
      }

      // Auto-destroy dead entities if configured
      if (health.currentHealth <= 0 && health.destroyOnDeath) {
        this.destroyEntity(entity);
      }
    }
  }
}
