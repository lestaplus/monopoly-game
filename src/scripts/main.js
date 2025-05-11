import Board from './board.js';
import Game from './game.js';
import Menu from './menu.js';
import Trade from './trade.js';
import CardManager from './cardManager.js';

const board = new Board();
await board.init();

const cardManager = new CardManager(board.tiles);
await cardManager.loadCards();

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
  const inputs = document.querySelectorAll('#player-names input');
  const playerNames = Array.from(inputs)
    .map((name) => name.value.trim())
    .filter((name) => name !== '');

  const expectedCount = getPlayerCount();
  if (playerNames.length < expectedCount) {
    alert(`Введіть імена для всіх ${expectedCount} гравців`);
    return;
  }

  document.getElementById('player-setup').style.display = 'none';
  document.getElementById('game-container').classList.remove('hidden');

  const game = new Game(board, menu, cardManager);
  game.init(playerNames);

  const trade = new Trade(game.getPlayers());

  menu.setButtonHandler('trade-btn', () => {
    const currentPlayerIndex = game.getCurrentPlayerIndex();
    const currentPlayerName = game.getPlayers()[currentPlayerIndex].name;
    const toPlayer = prompt(
      `${currentPlayerName}, з ким хочеш торгувати? Введи індекс гравця:`,
    );
    const toPlayerIndex = parseInt(toPlayer);

    if (
      !isNaN(toPlayerIndex) &&
      toPlayerIndex !== currentPlayerIndex &&
      toPlayerIndex >= 0 &&
      toPlayerIndex < game.getPlayers().length
    ) {
      trade.startTrade(currentPlayerIndex, toPlayerIndex);
    } else {
      alert(`Некоректний індекс гравця.`);
    }
  });
  menu.enableButton('trade-btn');
});
