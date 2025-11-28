export class Collider {
  constructor(width, height, offsetX = 0, offsetY = 0) {
    this.type = 'box'; // 'box', 'circle'
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.isTrigger = false;
    this.layer = 0;
    this.mask = -1; // Which layers to collide with (-1 = all)
    this.onCollision = null;
    this.onTriggerEnter = null;
    this.onTriggerExit = null;
  }
}
