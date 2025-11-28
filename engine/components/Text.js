export class Text {
  constructor(text = '', font = '16px Arial', color = '#ffffff') {
    this.text = text;
    this.font = font;
    this.color = color;
    this.align = 'left'; // 'left', 'center', 'right'
    this.baseline = 'top'; // 'top', 'middle', 'bottom'
    this.outline = false;
    this.outlineColor = '#000000';
    this.outlineWidth = 2;
    this.shadow = false;
    this.shadowColor = '#000000';
    this.shadowBlur = 4;
    this.shadowOffsetX = 2;
    this.shadowOffsetY = 2;
    this.maxWidth = null;
    this.lineHeight = 1.2;
  }
}
