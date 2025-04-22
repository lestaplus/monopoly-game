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
    const price = document.createElement('div');
    price.className = 'tile-price';
    price.innerText = `${tileData.price}₴`;
    content.appendChild(price);
  }

  if (index >= 0 && index <= 10) {
    tile.classList.add('line-top');
  }

  if (index >= 11 && index <= 19) {
    tile.classList.add('line-right');
    content.classList.add('text-right');
  }

  if (index >= 20 && index <= 30) {
    tile.classList.add('line-bottom');
  }

  if (index >= 31 && index <= 39) {
    tile.classList.add('line-left');
    content.classList.add('text-left');
  }
  tile.appendChild(content);
  tile.dataset.type = tileData.type;
  return tile;
}

async function loadTiles() {
  const res = await fetch('src/data/tiles.json');
  return await res.json();
}
