import BaseTile from '../tiles/BaseTile.js';
import { tileClasses } from '../tiles/tileClasses.js';

export function createTile(tile, board) {
  const TileClass = tileClasses[tile.type] || BaseTile;
  return new TileClass(tile, board);
}
