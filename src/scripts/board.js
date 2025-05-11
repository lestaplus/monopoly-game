import { createTile } from './createTile.js';
import TileRendering from './TileRendering.js';

class Board {
  constructor() {
    this.tiles = [];
  }

  async init() {
    this.tiles = await this.loadTiles();
    this.renderTiles();
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

  renderTiles() {
    const sectors = [
      {
        element: document.getElementById('top-row'),
        range: [0, 10],
        step: 1,
      },
      {
        element: document.getElementById('right-col'),
        range: [11, 19],
        step: 1,
      },
      {
        element: document.getElementById('bottom-row'),
        range: [30, 20],
        step: -1,
      },
      {
        element: document.getElementById('left-col'),
        range: [39, 31],
        step: -1,
      },
    ];

    sectors.forEach(({ element, range, step }) => {
      for (
        let i = range[0];
        step > 0 ? i <= range[1] : i >= range[1];
        i += step
      ) {
        const rendering = new TileRendering(this.tiles[i], i);
        element.appendChild(rendering.render());
      }
    });
  }

  updatePlayerPositions(players) {
    players.forEach((player, index) => {
      document
        .querySelectorAll(`.player-token.player-${index + 1}`)
        .forEach((element) => element.remove());

      const tileElement = document.querySelector(
        `.tile[data-index="${player.position}"]`,
      );
      if (tileElement) {
        const token = document.createElement('div');
        token.className = `player-token player-${index + 1}`;
        token.innerText = index + 1;
        tileElement.appendChild(token);
      }
    });
  }
}

export default Board;
