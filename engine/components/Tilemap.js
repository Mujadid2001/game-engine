export class Tilemap {
  constructor(tileWidth = 32, tileHeight = 32, mapWidth = 10, mapHeight = 10) {
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tiles = new Array(mapWidth * mapHeight).fill(0);
    this.tileset = null;
    this.tilesetColumns = 8;
    this.layers = new Map();
  }

  setTile(x, y, tileId) {
    if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      this.tiles[y * this.mapWidth + x] = tileId;
    }
  }

  getTile(x, y) {
    if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      return this.tiles[y * this.mapWidth + x];
    }
    return null;
  }

  worldToTile(worldX, worldY) {
    return {
      x: Math.floor(worldX / this.tileWidth),
      y: Math.floor(worldY / this.tileHeight)
    };
  }

  tileToWorld(tileX, tileY) {
    return {
      x: tileX * this.tileWidth,
      y: tileY * this.tileHeight
    };
  }
}
