export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
    this.loadedCount = 0;
    this.totalCount = 0;
  }

  loadImage(name, src) {
    this.totalCount++;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        this.loadedCount++;
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  loadSound(name, src) {
    this.totalCount++;
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.sounds.set(name, audio);
        this.loadedCount++;
        resolve(audio);
      };
      audio.onerror = reject;
      audio.src = src;
    });
  }

  getImage(name) {
    return this.images.get(name);
  }

  getSound(name) {
    return this.sounds.get(name);
  }

  getProgress() {
    return this.totalCount === 0 ? 1 : this.loadedCount / this.totalCount;
  }
}
