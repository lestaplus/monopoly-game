class Tile {
  constructor(data, index) {
    this.name = data.name;
    this.price = data.price;
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
      top: { range: [0, 10], tileLine: 'line-top', textClass: '' },
      right: {
        range: [11, 19],
        tileLine: 'line-right',
        textClass: 'text-right',
      },
      bottom: { range: [20, 30], tileLine: 'line-bottom', textClass: '' },
      left: { range: [31, 39], tileLine: 'line-left', textClass: 'text-left' },
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
    const topRow = document.getElementById('top-row');
    const rightCol = document.getElementById('right-col');
    const bottomRow = document.getElementById('bottom-row');
    const leftCol = document.getElementById('left-col');

    for (let i = 0; i < 11; i++) {
      topRow.appendChild(this.tiles[i].render());
    }
    for (let i = 11; i < 20; i++) {
      rightCol.appendChild(this.tiles[i].render());
    }
    for (let i = 30; i >= 20; i--) {
      bottomRow.appendChild(this.tiles[i].render());
    }
    for (let i = 39; i >= 31; i--) {
      leftCol.appendChild(this.tiles[i].render());
    }
  }
}

export default Board;
