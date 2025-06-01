import { createTile } from './factories/createTile.js';
import BoardRenderer from '../ui/layout/BoardRenderer.js';

class Board {
  #tiles = [];
  #renderer;

  constructor(modalService) {
    this.#renderer = new BoardRenderer(modalService);
  }

  async init() {
    this.#tiles = await this.#loadTiles();
    this.#renderer.render(this.#tiles);
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

  updatePlayerTokens(players) {
    this.#renderer.updatePlayerTokens(players);
  }

  get tiles() {
    return [...this.#tiles];
  }

  get renderer() {
    return this.#renderer;
  }
}

export default Board;
