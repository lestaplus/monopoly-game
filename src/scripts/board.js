export function initBoard() {
  const topRow = document.getElementById('top-row');
  const rightCol = document.getElementById('right-col');
  const bottomRow = document.getElementById('bottom-row');
  const leftCol = document.getElementById('left-col');

  for (let i = 0; i < 11; i++) {
    topRow.appendChild(createTile(`Top ${i}`));
    bottomRow.appendChild(createTile(`Bottom ${i}`));

    if (i > 0 && i < 10) {
      rightCol.appendChild(createTile(`Right ${i}`));
      leftCol.appendChild(createTile(`Left ${i}`));
    }
  }
}

function createTile(text) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.innerText = text;
  return tile;
}
