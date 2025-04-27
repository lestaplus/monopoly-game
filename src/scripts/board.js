class Tile {
  constructor(data, index) {
    this.name = data.name;
    this.price = data.price;
    this.amount = data.amount;
    this.color = data.color;
    this.type = data.type;
    this.index = index;
  }

  render() {
    const tile = document.createElement('div');
    tile.className = 'tile';

    if (this.color) {
      tile.classList.add(this.color);
    }

    const content = document.createElement('div');
    content.className = 'tile-content';
    content.innerText = this.name;

    if (this.price) {
      const priceDiv = document.createElement('div');
      priceDiv.className = 'tile-price';
      priceDiv.innerText = `${this.price}₴`;
      content.appendChild(priceDiv);
    }

    const sideClasses = {
      top: {
        range: [0, 10],
        tileLine: 'line-top',
        textClass: '',
      },
      right: {
        range: [11, 19],
        tileLine: 'line-right',
        textClass: 'text-right',
      },
      bottom: {
        range: [20, 30],
        tileLine: 'line-bottom',
        textClass: '',
      },
      left: {
        range: [31, 39],
        tileLine: 'line-left',
        textClass: 'text-left',
      },
    };

    for (const side in sideClasses) {
      const { range, tileLine, textClass } = sideClasses[side];
      if (this.index >= range[0] && this.index <= range[1]) {
        tile.classList.add(tileLine);
        if (textClass) {
          content.classList.add(textClass);
        }
      }
    }

    tile.appendChild(content);
    tile.dataset.type = this.type;
    tile.dataset.index = this.index;

    return tile;
  }
}

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
    return tilesData.map((data, index) => new Tile(data, index));
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
        element.appendChild(this.tiles[i].render());
      }
    });
  }

  updatePlayerPositions(players) {
    players.forEach((player, index) => {
      document
        .querySelectorAll(`.player-token.player-${index}`)
        .forEach((element) => element.remove());

      const tileElement = document.querySelector(
        `.tile[data-index="${player.position}"]`,
      );
      if (tileElement) {
        const token = document.createElement('div');
        token.className = `player-token player-${index}`;
        token.innerText = index + 1;
        tileElement.appendChild(token);
      }
    });
  }
}

export default Board;
