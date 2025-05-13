import { createTile } from './createTile.js';
import BoardRenderer from './ui/BoardRenderer.js';

class Board {
  constructor() {
    this.tiles = [];
    this.renderer = new BoardRenderer();
  }

  async init() {
    this.tiles = await this.loadTiles();
    this.renderer.renderTiles(this.tiles);
  }

  async loadTiles() {
    const res = await fetch('src/data/tiles.json');
    if (!res.ok) {
      throw new Error(`Помилка завантаження клітинок: ${res.status}`);
    }
    const tilesData = await res.json();
    return tilesData.map((data, index) => {
      data.index = index;
      return createTile(data);
    });
  }

  updatePlayerPositions(players) {
    this.renderer.updatePlayerPositions(players);
  }
}

export default Board;
