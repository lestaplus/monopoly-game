import {
  handleProperty,
  handleRailroad,
  handleUtility,
  handleChance,
  handleCommunity,
  handleTax,
  handleCasino,
  handleJail,
  handleGoToJail,
} from './tileActions.js';
import Player from './player.js';

class Game {
  constructor(board, menu) {
    this.board = board;
    this.menu = menu;
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  init(playersData) {
    this.players = playersData.map((name, index) => new Player(name, index));

    this.updatePlayerPanel();
    this.board.updatePlayerPositions(this.players);
    this.menu.setButtonHandler('dice-btn', () => this.handleRollDice());
    setTimeout(() => this.startTurn(), 0);
  }

  updatePlayerPanel() {
    const panel = document.getElementById('player-panel');
    panel.innerHTML = '';
    this.players.forEach((player, index) => {
      player.setActive(index === this.currentPlayerIndex);
      panel.appendChild(player.element);
    });
  }

  rollDice() {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;

    alert(`Випало ${firstDice} + ${secondDice} = ${firstDice + secondDice}`);
    return firstDice + secondDice;
  }

  movePlayer(player, steps) {
    const prevPosition = player.position;
    player.move(steps, this.board.tiles.length);

    if (player.position < prevPosition) {
      player.setBalance(2000);
      alert(
        `${player.name} проходить повз старт та отримує 2000₴. Баланс: ${player.balance}₴`,
      );
    }

    alert(`${player.name} переміщується на позицію ${player.position}`);
    this.board.updatePlayerPositions(this.players);
    player.updateDisplay();
  }

  startTurn() {
    const player = this.players[this.currentPlayerIndex];

    if (player.inJail) {
      const freed = player.tryExitJail();
      if (!freed) {
        this.endTurn();
        return;
      }
    }

    if (player.shouldSkipTurn()) {
      this.endTurn();
      return;
    }

    this.players.forEach((player, index) =>
      player.setActive(index === this.currentPlayerIndex),
    );
    setTimeout(() => alert(`Хід гравця: ${player.name}`), 0);
    this.menu.enableButton('dice-btn');
  }

  handleTile(player) {
    const tile = this.board.tiles[player.position];
    alert(`${player.name} стоїть на клітинці ${tile.name}`);

    const tileHandlers = {
      tax: handleTax,
      property: handleProperty,
      railroad: handleRailroad,
      utility: handleUtility,
      chance: handleChance,
      community: handleCommunity,
      casino: handleCasino,
      jail: handleJail,
      gotojail: handleGoToJail,
    };

    const handler = tileHandlers[tile.type];
    if (handler) {
      handler(player, tile, this.players);
    }
  }

  handleRollDice() {
    const player = this.players[this.currentPlayerIndex];
    const steps = this.rollDice();

    this.movePlayer(player, steps);
    this.handleTile(player);
    this.endTurn();
  }

  endTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    this.updatePlayerPanel();
    this.startTurn();
  }

  getPlayers() {
    return this.players;
  }

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex;
  }
}

export default Game;
