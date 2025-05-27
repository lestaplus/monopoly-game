import Board from './game/Board.js';
import Game from './game/Game.js';
import GameUI from './ui/GameUI.js';
import Trade from './game/Trade.js';
import { initCardGenerators } from './game/eventCards.js';
import { modalService } from './ui/services/modalService.js';

const board = new Board();
await board.init();

await initCardGenerators();

const gameUI = new GameUI();

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

startGameButton.addEventListener('click', async () => {
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

  const game = new Game(board, gameUI, modalService);

  game.init(playerNames);

  const trade = new Trade(game.players);

  document.getElementById('trade-btn')?.addEventListener('click', async () => {
    gameUI.disableButton('trade-btn');

    await trade.startTrade(game.currentPlayerIndex, modalService.tradeModal);

    gameUI.enableButton('trade-btn');
  });
  gameUI.enableButton('trade-btn');

  await game.startGame();
});
