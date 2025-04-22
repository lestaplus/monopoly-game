export async function initBoard() {
  const tiles = await loadTiles();

  const topRow = document.getElementById('top-row');
  const rightCol = document.getElementById('right-col');
  const bottomRow = document.getElementById('bottom-row');
  const leftCol = document.getElementById('left-col');

  for (let i = 0; i < 11; i++) {
    topRow.appendChild(createTile(tiles[i], i));
  }

  for (let i = 11; i < 20; i++) {
    rightCol.appendChild(createTile(tiles[i], i));
  }

  for (let i = 30; i >= 20; i--) {
    bottomRow.appendChild(createTile(tiles[i], i));
  }

  for (let i = 39; i >= 31; i--) {
    leftCol.appendChild(createTile(tiles[i], i));
  }
}

function createTile(tileData, index) {
  const tile = document.createElement('div');
  tile.className = 'tile';

  if (tileData.color) {
    tile.classList.add(tileData.color);
  }

  const content = document.createElement('div');
  content.className = 'tile-content';
  content.innerText = tileData.name;

  if (tileData.price) {
    content.appendChild(createPrice(tileData.price));
  }

  const sideClasses = {
    top: { range: [0, 10], tileLine: 'line-top', textClass: '' },
    right: { range: [11, 19], tileLine: 'line-right', textClass: 'text-right' },
    bottom: { range: [20, 30], tileLine: 'line-bottom', textClass: '' },
    left: { range: [31, 39], tileLine: 'line-left', textClass: 'text-left' },
  };

  for (const side in sideClasses) {
    const { range, tileLine, textClass } = sideClasses[side];

    if (index >= range[0] && index <= range[1]) {
      tile.classList.add(tileLine);
      if (textClass) {
        content.classList.add(textClass);
      }
    }
  }

  tile.appendChild(content);
  tile.dataset.type = tileData.type;
  return tile;
}

function createPrice(price) {
  const priceDiv = document.createElement('div');
  priceDiv.className = 'tile-price';
  priceDiv.innerText = `${price}₴`;
  return priceDiv;
}

async function loadTiles() {
  const res = await fetch('src/data/tiles.json');
  if (!res.ok) {
    throw new Error(`Помилка завантаження клітинок: ${res.status}`);
  }
  return await res.json();
}
