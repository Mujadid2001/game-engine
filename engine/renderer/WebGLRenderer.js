export class WebGLRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    this.textures = new Map();
    this.shaderProgram = null;
    this.vertexBuffer = null;
    this.texCoordBuffer = null;
    this.indexBuffer = null;
    this.currentTexture = null;
    this.batchSize = 1000;
    this.batchVertices = [];
    this.batchTexCoords = [];
    this.batchIndices = [];
    this.batchCount = 0;

    this.init();
  }

  init() {
    const gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    this.setupShaders();
    this.setupBuffers();
  }

  setupShaders() {
    const gl = this.gl;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      uniform vec2 u_resolution;
      uniform mat3 u_matrix;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 position = (u_matrix * vec3(a_position, 1)).xy;
        vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec4 u_tint;
      uniform float u_alpha;
      varying vec2 v_texCoord;
      
      void main() {
        vec4 color = texture2D(u_texture, v_texCoord);
        gl_FragColor = color * u_tint * vec4(1, 1, 1, u_alpha);
      }
    `;

    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      throw new Error('Shader program failed to link: ' + gl.getProgramInfoLog(this.shaderProgram));
    }

    gl.useProgram(this.shaderProgram);

    // Get attribute and uniform locations
    this.positionLocation = gl.getAttribLocation(this.shaderProgram, 'a_position');
    this.texCoordLocation = gl.getAttribLocation(this.shaderProgram, 'a_texCoord');
    this.resolutionLocation = gl.getUniformLocation(this.shaderProgram, 'u_resolution');
    this.matrixLocation = gl.getUniformLocation(this.shaderProgram, 'u_matrix');
    this.tintLocation = gl.getUniformLocation(this.shaderProgram, 'u_tint');
    this.alphaLocation = gl.getUniformLocation(this.shaderProgram, 'u_alpha');
  }

  createShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error('Shader compilation failed: ' + info);
    }

    return shader;
  }

  setupBuffers() {
    const gl = this.gl;

    this.vertexBuffer = gl.createBuffer();
    this.texCoordBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
  }

  loadTexture(imageSrc) {
    if (this.textures.has(imageSrc)) {
      return this.textures.get(imageSrc);
    }

    const gl = this.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Temporary 1x1 pixel
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([255, 0, 255, 255]));

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    image.src = imageSrc;

    this.textures.set(imageSrc, texture);
    return texture;
  }

  clear(color = null) {
    const gl = this.gl;
    if (color) {
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;
      gl.clearColor(r, g, b, 1.0);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  beginBatch() {
    this.batchVertices = [];
    this.batchTexCoords = [];
    this.batchIndices = [];
    this.batchCount = 0;
  }

  drawSprite(sprite, x, y, camera = null) {
    if (!sprite.visible) return;

    const texture = this.loadTexture(sprite.imageSrc);
    
    if (this.currentTexture !== texture || this.batchCount >= this.batchSize) {
      this.flush();
      this.currentTexture = texture;
    }

    // Calculate transformed vertices
    const hw = sprite.width / 2;
    const hh = sprite.height / 2;
    const cos = Math.cos(sprite.rotation);
    const sin = Math.sin(sprite.rotation);
    const sx = sprite.scaleX * (sprite.flipX ? -1 : 1);
    const sy = sprite.scaleY * (sprite.flipY ? -1 : 1);

    const vertices = [
      -hw * sx, -hh * sy,
       hw * sx, -hh * sy,
       hw * sx,  hh * sy,
      -hw * sx,  hh * sy
    ];

    // Apply rotation and translation
    const transformed = [];
    for (let i = 0; i < vertices.length; i += 2) {
      const vx = vertices[i];
      const vy = vertices[i + 1];
      transformed.push(
        x + vx * cos - vy * sin,
        y + vx * sin + vy * cos
      );
    }

    // Texture coordinates
    let tx1 = 0, ty1 = 0, tx2 = 1, ty2 = 1;
    if (sprite.frameX !== undefined && sprite.frameY !== undefined && sprite.image) {
      tx1 = sprite.frameX / sprite.image.width;
      ty1 = sprite.frameY / sprite.image.height;
      tx2 = (sprite.frameX + sprite.width) / sprite.image.width;
      ty2 = (sprite.frameY + sprite.height) / sprite.image.height;
    }

    const texCoords = [
      tx1, ty1,
      tx2, ty1,
      tx2, ty2,
      tx1, ty2
    ];

    // Indices
    const baseIndex = this.batchCount * 4;
    const indices = [
      baseIndex, baseIndex + 1, baseIndex + 2,
      baseIndex, baseIndex + 2, baseIndex + 3
    ];

    this.batchVertices.push(...transformed);
    this.batchTexCoords.push(...texCoords);
    this.batchIndices.push(...indices);
    this.batchCount++;
  }

  flush() {
    if (this.batchCount === 0) return;

    const gl = this.gl;

    gl.useProgram(this.shaderProgram);
    gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
    gl.uniformMatrix3fv(this.matrixLocation, false, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    gl.uniform4f(this.tintLocation, 1, 1, 1, 1);
    gl.uniform1f(this.alphaLocation, 1.0);

    // Bind texture
    gl.bindTexture(gl.TEXTURE_2D, this.currentTexture);

    // Upload vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.batchVertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Upload texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.batchTexCoords), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Upload indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.batchIndices), gl.DYNAMIC_DRAW);

    // Draw
    gl.drawElements(gl.TRIANGLES, this.batchIndices.length, gl.UNSIGNED_SHORT, 0);

    this.beginBatch();
  }

  drawRect(x, y, width, height, color = '#000', alpha = 1) {
    // Fallback for shapes - flush pending sprites first
    this.flush();
  }

  drawCircle(x, y, radius, color = '#fff', alpha = 1) {
    this.flush();
  }

  save() {
    // WebGL uses matrix stacks - would implement here
  }

  restore() {
    // Restore matrix state
  }

  drawTile(tileset, sx, sy, sw, sh, dx, dy, dw, dh) {
    // Tile rendering using texture atlas
    const texture = this.loadTexture(tileset.src || tileset);
    if (this.currentTexture !== texture) {
      this.flush();
      this.currentTexture = texture;
    }
    // Would implement tile quad batching here
  }
}
