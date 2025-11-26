import { Scene } from '../../engine/scene/Scene.js';

export class GameOverScene extends Scene {
  constructor() {
    super('GameOver');
  }

  onCreate() {
    console.log('Game Over Scene Created');
    // TODO: Create game over UI entities
  }

  onDestroy() {
    console.log('Game Over Scene Destroyed');
  }

  update(deltaTime) {
    // Handle game over logic
  }
}
