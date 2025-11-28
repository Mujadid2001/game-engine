export class Button {
  constructor(width, height, text = '') {
    this.width = width;
    this.height = height;
    this.text = text;
    this.isHovered = false;
    this.isPressed = false;
    this.isDisabled = false;
    this.onClick = null;
    this.onHover = null;
    this.onRelease = null;
    
    // Visual states
    this.normalColor = '#4a4a4a';
    this.hoverColor = '#6a6a6a';
    this.pressedColor = '#2a2a2a';
    this.disabledColor = '#1a1a1a';
    
    this.textColor = '#ffffff';
    this.borderColor = '#888888';
    this.borderWidth = 2;
  }
}
