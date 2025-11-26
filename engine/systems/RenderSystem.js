import { System } from '../core/System.js';
import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { Query } from '../core/Query.js';

export class RenderSystem extends System {
  constructor(componentManager, entityManager, renderer) {
    super();
    this.query = new Query(componentManager, entityManager);
    this.componentManager = componentManager;
    this.renderer = renderer;
  }

  update(deltaTime) {
    this.renderer.clear();

    const entities = this.query.getEntitiesWithComponents(Position, Sprite);

    for (const entity of entities) {
      const position = this.componentManager.getComponent(entity, Position);
      const sprite = this.componentManager.getComponent(entity, Sprite);

      this.renderer.drawSprite(sprite, position.x, position.y);
    }
  }
}
