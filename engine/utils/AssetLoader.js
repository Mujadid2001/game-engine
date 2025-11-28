export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
    this.json = new Map();
    this.loadedCount = 0;
    this.totalCount = 0;
    this.errors = [];
  }

  async loadImage(name, src) {
    this.totalCount++;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        this.loadedCount++;
        resolve(img);
      };
      img.onerror = (error) => {
        this.errors.push({ type: 'image', name, src, error });
        this.loadedCount++;
        reject(error);
      };
      img.src = src;
    });
  }

  async loadSound(name, src) {
    this.totalCount++;
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.sounds.set(name, audio);
        this.loadedCount++;
        resolve(audio);
      };
      audio.onerror = (error) => {
        this.errors.push({ type: 'sound', name, src, error });
        this.loadedCount++;
        reject(error);
      };
      audio.src = src;
    });
  }

  async loadJSON(name, src) {
    this.totalCount++;
    try {
      const response = await fetch(src);
      const data = await response.json();
      this.json.set(name, data);
      this.loadedCount++;
      return data;
    } catch (error) {
      this.errors.push({ type: 'json', name, src, error });
      this.loadedCount++;
      throw error;
    }
  }

  async loadAssets(manifest) {
    const promises = [];

    if (manifest.images) {
      for (const [name, src] of Object.entries(manifest.images)) {
        promises.push(this.loadImage(name, src).catch(() => {}));
      }
    }

    if (manifest.sounds) {
      for (const [name, src] of Object.entries(manifest.sounds)) {
        promises.push(this.loadSound(name, src).catch(() => {}));
      }
    }

    if (manifest.json) {
      for (const [name, src] of Object.entries(manifest.json)) {
        promises.push(this.loadJSON(name, src).catch(() => {}));
      }
    }

    await Promise.all(promises);
    return this.errors.length === 0;
  }

  getImage(name) {
    return this.images.get(name);
  }

  getSound(name) {
    return this.sounds.get(name);
  }

  getJSON(name) {
    return this.json.get(name);
  }

  getProgress() {
    return this.totalCount === 0 ? 1 : this.loadedCount / this.totalCount;
  }

  getErrors() {
    return this.errors;
  }

  reset() {
    this.images.clear();
    this.sounds.clear();
    this.json.clear();
    this.loadedCount = 0;
    this.totalCount = 0;
    this.errors = [];
  }
}
