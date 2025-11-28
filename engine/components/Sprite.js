export class Sprite {
  constructor(imageSrc, width = 32, height = 32) {
    this.imageSrc = imageSrc;
    this.width = width;
    this.height = height;
    this.image = null;
    this.frameX = 0;
    this.frameY = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
    this.visible = true;
    this.zIndex = 0;
    this.flipX = false;
    this.flipY = false;
    this.tint = null;
  }
}
