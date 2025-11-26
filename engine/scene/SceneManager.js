export class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
  }

  addScene(name, scene) {
    this.scenes.set(name, scene);
  }

  loadScene(name, world) {
    if (this.currentScene) {
      this.currentScene.onDestroy();
    }

    const scene = this.scenes.get(name);
    if (scene) {
      this.currentScene = scene;
      this.currentScene.init(world);
    } else {
      console.error(`Scene "${name}" not found`);
    }
  }

  update(deltaTime) {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }
}
