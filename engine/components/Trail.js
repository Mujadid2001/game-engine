export class Trail {
  constructor() {
    this.points = [];
    this.maxPoints = 20;
    this.width = 5;
    this.color = '#ffffff';
    this.fadeOut = true;
    this.minDistance = 5; // Minimum distance before adding new point
  }

  addPoint(x, y) {
    this.points.push({ x, y, age: 0 });
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  clear() {
    this.points = [];
  }
}
