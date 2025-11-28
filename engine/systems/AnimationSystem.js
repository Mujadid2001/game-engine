import { System } from '../core/System.js';
import { Animation } from '../components/Animation.js';
import { Sprite } from '../components/Sprite.js';

export class AnimationSystem extends System {
  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Animation, Sprite);

    for (const entity of entities) {
      const animation = this.getComponent(entity, Animation);
      const sprite = this.getComponent(entity, Sprite);

      if (!animation.isPlaying || animation.frames.length === 0) continue;

      animation.elapsed += deltaTime;

      // Check if it's time to advance frame
      if (animation.elapsed >= animation.frameDuration) {
        animation.elapsed -= animation.frameDuration;
        animation.currentFrame++;

        // Handle animation end
        if (animation.currentFrame >= animation.frames.length) {
          if (animation.loop) {
            animation.currentFrame = 0;
          } else {
            animation.currentFrame = animation.frames.length - 1;
            animation.isPlaying = false;
            
            if (animation.onComplete) {
              animation.onComplete();
            }
          }
        }

        // Update sprite with current frame
        const frame = animation.frames[animation.currentFrame];
        
        if (typeof frame === 'string') {
          sprite.imageSrc = frame;
        } else if (typeof frame === 'object') {
          sprite.frameX = frame.x || 0;
          sprite.frameY = frame.y || 0;
          if (frame.width) sprite.width = frame.width;
          if (frame.height) sprite.height = frame.height;
        } else if (typeof frame === 'number') {
          // Frame index in spritesheet
          sprite.frameX = frame;
        }
      }
    }
  }
}
