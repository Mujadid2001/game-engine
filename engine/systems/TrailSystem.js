import { System } from '../core/System.js';
import { Trail } from '../components/Trail.js';
import { Position } from '../components/Position.js';

export class TrailSystem extends System {
  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Trail, Position);

    for (const entity of entities) {
      const trail = this.getComponent(entity, Trail);
      const position = this.getComponent(entity, Position);

      // Age existing points
      for (const point of trail.points) {
        point.age += deltaTime;
      }

      // Add new point if moved enough
      const shouldAdd = trail.points.length === 0 || 
        Math.hypot(
          position.x - trail.points[trail.points.length - 1].x,
          position.y - trail.points[trail.points.length - 1].y
        ) >= trail.minDistance;

      if (shouldAdd) {
        trail.addPoint(position.x, position.y);
      }
    }
  }

  render(renderer) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Trail);

    for (const entity of entities) {
      const trail = this.getComponent(entity, Trail);

      if (trail.points.length < 2) continue;

      for (let i = 0; i < trail.points.length - 1; i++) {
        const p1 = trail.points[i];
        const p2 = trail.points[i + 1];
        
        const alpha = trail.fadeOut ? (1 - i / trail.points.length) : 1;
        
        renderer.drawLine(
          p1.x, p1.y, p2.x, p2.y,
          trail.width,
          trail.color,
          alpha
        );
      }
    }
  }
}
