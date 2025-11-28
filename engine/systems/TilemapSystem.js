import { System } from '../core/System.js';
import { Tilemap } from '../components/Tilemap.js';
import { Position } from '../components/Position.js';

export class TilemapSystem extends System {
  render(renderer, camera) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Tilemap, Position);

    for (const entity of entities) {
      const tilemap = this.getComponent(entity, Tilemap);
      const position = this.getComponent(entity, Position);

      if (!tilemap.tileset) continue;

      // Calculate visible tile range
      const startX = Math.max(0, Math.floor(-position.x / tilemap.tileWidth));
      const startY = Math.max(0, Math.floor(-position.y / tilemap.tileHeight));
      const endX = Math.min(tilemap.mapWidth, startX + Math.ceil(renderer.canvas.width / tilemap.tileWidth) + 1);
      const endY = Math.min(tilemap.mapHeight, startY + Math.ceil(renderer.canvas.height / tilemap.tileHeight) + 1);

      // Draw tiles
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tileId = tilemap.getTile(x, y);
          if (tileId === 0) continue;

          const tileX = (tileId - 1) % tilemap.tilesetColumns;
          const tileY = Math.floor((tileId - 1) / tilemap.tilesetColumns);

          renderer.drawTile(
            tilemap.tileset,
            tileX * tilemap.tileWidth,
            tileY * tilemap.tileHeight,
            tilemap.tileWidth,
            tilemap.tileHeight,
            position.x + x * tilemap.tileWidth,
            position.y + y * tilemap.tileHeight,
            tilemap.tileWidth,
            tilemap.tileHeight
          );
        }
      }
    }
  }
}
