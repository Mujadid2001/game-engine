export class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scenes = new Map();
    this.currentScene = null;
    this.nextScene = null;
  }

  addScene(name, scene) {
    this.scenes.set(name, scene);
  }

  loadScene(name) {
    const scene = this.scenes.get(name);
    if (!scene) {
      console.error(`Scene "${name}" not found`);
      return;
    }

    // Queue scene change for next frame
    this.nextScene = scene;
  }

  update(deltaTime) {
    // Handle scene transition
    if (this.nextScene) {
      if (this.currentScene) {
        this.currentScene.onDestroy();
      }
      
      this.currentScene = this.nextScene;
      this.currentScene.init(this.engine);
      this.nextScene = null;
    }

    // Update current scene
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  render() {
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render();
    }
  }

  getCurrentScene() {
    return this.currentScene;
  }
}
