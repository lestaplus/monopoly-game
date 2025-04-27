import Board from './board.js';
import Game from './game.js';
import Menu from './menu.js';

const board = new Board();
await board.init();

const menu = new Menu();
menu.init();

const playerCountSelect = document.getElementById('player-count');
const playerNamesElement = document.getElementById('player-names');
const startGameButton = document.getElementById('start-game');

const getPlayerCount = () => parseInt(playerCountSelect.value);

playerCountSelect.addEventListener('change', () => {
  const count = getPlayerCount();
  playerNamesElement.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Гравець ${i}`;
    input.id = `player-${i}`;
    playerNamesElement.appendChild(input);
  }
});

playerCountSelect.dispatchEvent(new Event('change'));

startGameButton.addEventListener('click', () => {
  const inputs = document.querySelectorAll('input');
  const playerNames = Array.from(inputs)
    .map((name) => name.value.trim())
    .filter((name) => name !== '');

  const expectedCount = getPlayerCount();
  if (playerNames.length < expectedCount) {
    alert(`Введіть імена для всіх ${expectedCount} гравців`);
    return;
  }

  const game = new Game(board, menu);
  game.init(playerNames);
  document.getElementById('player-setup').style.display = 'none';
});
