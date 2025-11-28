import { System } from '../core/System.js';
import { ParticleEmitter } from '../components/ParticleEmitter.js';
import { Position } from '../components/Position.js';

export class ParticleSystem extends System {
  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(ParticleEmitter, Position);

    for (const entity of entities) {
      const emitter = this.getComponent(entity, ParticleEmitter);
      const position = this.getComponent(entity, Position);

      if (!emitter.active) continue;

      // Emit particles
      if (emitter.burst) {
        if (emitter.burstCount > 0) {
          emitter.emit(emitter.burstCount);
          emitter.burstCount = 0;
          emitter.active = false;
        }
      } else {
        emitter.emissionTimer += deltaTime;
        const emitInterval = 1 / emitter.emissionRate;
        
        while (emitter.emissionTimer >= emitInterval) {
          emitter.emit(1);
          emitter.emissionTimer -= emitInterval;
        }
      }

      // Update particles
      for (let i = emitter.particles.length - 1; i >= 0; i--) {
        const particle = emitter.particles[i];
        
        particle.life -= deltaTime;
        
        if (particle.life <= 0) {
          emitter.particles.splice(i, 1);
          continue;
        }

        // Update position
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;

        // Apply gravity
        particle.vy += emitter.gravity * deltaTime;

        // Update alpha based on lifetime
        particle.alpha = particle.life / particle.maxLife;
      }
    }
  }

  render(renderer, camera) {
    if (!this.enabled) return;

    const entities = this.queryEntities(ParticleEmitter, Position);

    for (const entity of entities) {
      const emitter = this.getComponent(entity, ParticleEmitter);
      const position = this.getComponent(entity, Position);

      for (const particle of emitter.particles) {
        const worldX = position.x + particle.x;
        const worldY = position.y + particle.y;

        renderer.drawCircle(
          worldX, 
          worldY, 
          particle.size,
          emitter.color,
          particle.alpha
        );
      }
    }
  }
}
