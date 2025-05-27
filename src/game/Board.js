import { createTile } from './factories/createTile.js';
import BoardRenderer from '../ui/layout/BoardRenderer.js';

class Board {
  #tiles = [];
  #renderer;

  constructor() {
    this.#renderer = new BoardRenderer();
  }

  async init() {
    this.#tiles = await this.#loadTiles();
    this.#renderer.renderTiles(this.#tiles);
  }

  async #loadTiles() {
    const res = await fetch('/assets/data/tiles.json');
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
    this.#renderer.updatePlayerPositions(players);
  }

  get tiles() {
    return [...this.#tiles];
  }
}

export default Board;
