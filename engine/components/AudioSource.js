export class AudioSource {
  constructor(soundName = null) {
    this.soundName = soundName;
    this.volume = 1.0;
    this.loop = false;
    this.playOnStart = false;
    this.spatial = false; // 3D positional audio
    this.maxDistance = 1000;
    this.rolloffFactor = 1;
    this.isPlaying = false;
    this.audioElement = null;
  }

  play() {
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  pause() {
    this.isPlaying = false;
  }
}
