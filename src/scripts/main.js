import Board from './board.js';
import Game from './game.js';

document.addEventListener('DOMContentLoaded', async () => {
  const board = new Board();
  await board.init();

  const game = new Game(board);

  const playerNames = ['player1', 'player2']; // add player selection from html page
  game.init(playerNames);
});
