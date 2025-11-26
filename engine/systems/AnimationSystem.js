import { System } from '../core/System.js';
import { Animation } from '../components/Animation.js';
import { Sprite } from '../components/Sprite.js';
import { Query } from '../core/Query.js';

export class AnimationSystem extends System {
  constructor(componentManager, entityManager) {
    super();
    this.query = new Query(componentManager, entityManager);
    this.componentManager = componentManager;
  }

  update(deltaTime) {
    const entities = this.query.getEntitiesWithComponents(Animation, Sprite);

    for (const entity of entities) {
      const animation = this.componentManager.getComponent(entity, Animation);
      const sprite = this.componentManager.getComponent(entity, Sprite);

      if (!animation.isPlaying) continue;

      animation.elapsed += deltaTime;

      if (animation.elapsed >= 1 / animation.frameRate) {
        animation.elapsed = 0;
        animation.currentFrame++;

        if (animation.currentFrame >= animation.frames.length) {
          if (animation.loop) {
            animation.currentFrame = 0;
          } else {
            animation.currentFrame = animation.frames.length - 1;
            animation.isPlaying = false;
          }
        }

        sprite.imageSrc = animation.frames[animation.currentFrame];
      }
    }
  }
}
