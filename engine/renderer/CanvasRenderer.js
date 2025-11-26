export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.imageCache = new Map();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSprite(sprite, x, y) {
    if (!sprite.image) {
      // Load image if not cached
      if (this.imageCache.has(sprite.imageSrc)) {
        sprite.image = this.imageCache.get(sprite.imageSrc);
      } else {
        sprite.image = new Image();
        sprite.image.src = sprite.imageSrc;
        this.imageCache.set(sprite.imageSrc, sprite.image);
      }
    }

    if (sprite.image.complete) {
      this.ctx.drawImage(sprite.image, x, y, sprite.width, sprite.height);
    }
  }

  drawRect(x, y, width, height, color = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  drawText(text, x, y, font = '16px Arial', color = '#000') {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }
}
