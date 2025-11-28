export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.imageCache = new Map();
    
    // Enable image smoothing for better quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  clear(color = null) {
    if (color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  translate(x, y) {
    this.ctx.translate(x, y);
  }

  rotate(angle) {
    this.ctx.rotate(angle);
  }

  scale(x, y) {
    this.ctx.scale(x, y);
  }

  drawSprite(sprite, x, y) {
    if (!sprite.visible) return;

    // Load and cache image
    if (!sprite.image) {
      if (this.imageCache.has(sprite.imageSrc)) {
        sprite.image = this.imageCache.get(sprite.imageSrc);
      } else {
        sprite.image = new Image();
        sprite.image.src = sprite.imageSrc;
        this.imageCache.set(sprite.imageSrc, sprite.image);
        return; // Wait for next frame
      }
    }

    if (!sprite.image.complete) return;

    this.ctx.save();
    
    // Apply transformations
    this.ctx.globalAlpha = sprite.opacity;
    this.ctx.translate(x + sprite.width / 2, y + sprite.height / 2);
    this.ctx.rotate(sprite.rotation);
    this.ctx.scale(
      sprite.scaleX * (sprite.flipX ? -1 : 1),
      sprite.scaleY * (sprite.flipY ? -1 : 1)
    );

    // Draw sprite
    if (sprite.frameX !== undefined && sprite.frameY !== undefined) {
      // Spritesheet
      this.ctx.drawImage(
        sprite.image,
        sprite.frameX, sprite.frameY,
        sprite.width, sprite.height,
        -sprite.width / 2, -sprite.height / 2,
        sprite.width, sprite.height
      );
    } else {
      // Single image
      this.ctx.drawImage(
        sprite.image,
        -sprite.width / 2, -sprite.height / 2,
        sprite.width, sprite.height
      );
    }

    // Apply tint
    if (sprite.tint) {
      this.ctx.globalCompositeOperation = 'multiply';
      this.ctx.fillStyle = sprite.tint;
      this.ctx.fillRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      this.ctx.globalCompositeOperation = 'source-over';
    }

    this.ctx.restore();
  }

  drawRect(x, y, width, height, color = '#000', alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.restore();
  }

  drawCircle(x, y, radius, color = '#fff', alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawLine(x1, y1, x2, y2, width = 1, color = '#fff', alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawText(text, x, y) {
    if (typeof text === 'object') {
      // Text component
      this.ctx.save();
      this.ctx.font = text.font;
      this.ctx.fillStyle = text.color;
      this.ctx.textAlign = text.align;
      this.ctx.textBaseline = text.baseline;

      if (text.shadow) {
        this.ctx.shadowColor = text.shadowColor;
        this.ctx.shadowBlur = text.shadowBlur;
        this.ctx.shadowOffsetX = text.shadowOffsetX;
        this.ctx.shadowOffsetY = text.shadowOffsetY;
      }

      if (text.outline) {
        this.ctx.strokeStyle = text.outlineColor;
        this.ctx.lineWidth = text.outlineWidth;
        this.ctx.strokeText(text.text, x, y, text.maxWidth);
      }

      this.ctx.fillText(text.text, x, y, text.maxWidth);
      this.ctx.restore();
    } else {
      // Simple text
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '16px Arial';
      this.ctx.fillText(text, x, y);
    }
  }

  drawButton(button, x, y) {
    this.ctx.save();

    // Determine button color based on state
    let bgColor = button.normalColor;
    if (button.isDisabled) {
      bgColor = button.disabledColor;
    } else if (button.isPressed) {
      bgColor = button.pressedColor;
    } else if (button.isHovered) {
      bgColor = button.hoverColor;
    }

    // Draw background
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(x, y, button.width, button.height);

    // Draw border
    if (button.borderWidth > 0) {
      this.ctx.strokeStyle = button.borderColor;
      this.ctx.lineWidth = button.borderWidth;
      this.ctx.strokeRect(x, y, button.width, button.height);
    }

    // Draw text
    this.ctx.fillStyle = button.textColor;
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(button.text, x + button.width / 2, y + button.height / 2);

    this.ctx.restore();
  }

  drawTile(tileset, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (tileset && tileset.complete) {
      this.ctx.drawImage(tileset, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  setAlpha(alpha) {
    this.ctx.globalAlpha = alpha;
  }

  getContext() {
    return this.ctx;
  }
}
