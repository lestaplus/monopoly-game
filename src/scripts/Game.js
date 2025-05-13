import Player from './Player.js';

class Game {
  constructor(board, ui, cardManager) {
    this.board = board;
    this.ui = ui;
    this.cardManager = cardManager;
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  init(playersData) {
    this.players = playersData.map((name, index) => new Player(name, index));

    this.ui.updatePlayerPanel(this.players, this.currentPlayerIndex);
    this.board.updatePlayerPositions(this.players);
    this.ui.setDiceButtonHandler(() => this.handleRollDice());

    setTimeout(() => this.startTurn(), 0);
  }

  rollDice() {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;
    const total = firstDice + secondDice;

    alert(`Випало ${firstDice} + ${secondDice} = ${total}`);

    return { firstDice, secondDice, total };
  }

  movePlayer(player, steps) {
    const prevPosition = player.position;
    player.move(steps, this.board.tiles.length);

    if (player.position > 0 && player.position < prevPosition) {
      player.setBalance(200);
      alert(
        `${player.name} проходить повз старт та отримує 200₴. Баланс: ${player.balance}₴`,
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
    this.ui.enableDiceButton();
  }

  handleTile(player, context = {}) {
    const tile = this.board.tiles[player.position];
    const initialPosition = player.position;
    alert(`${player.name} стоїть на клітинці ${tile.name}`);

    const localContext = {
      ...context,
      cardManager: this.cardManager,
      board: this.board,
      players: this.players,
      game: this,
    };

    tile.activate(player, this.players, localContext);

    const moved = player.position !== initialPosition;
    const newTile = this.board.tiles[player.position];

    if (moved && newTile !== tile) {
      this.handleTile(player, context);
    }
  }

  handleRollDice() {
    const player = this.players[this.currentPlayerIndex];
    const roll = this.rollDice();
    const { firstDice, secondDice, total: steps } = roll;

    if (firstDice === secondDice) {
      player.incrementDoubleRolls();

      if (player.getDoubleRollsCount() >= 3) {
        alert(`${player.name} викинув 3 дублі поспіль і йде до в'язниці!`);
        player.goToJail();
        this.board.updatePlayerPositions(this.players);
        this.endTurn();
        return;
      } else {
        alert(`${player.name} викинув дубль і ходить ще раз.`);
        this.movePlayer(player, steps);
        this.handleTile(player);
        this.startTurn();
        return;
      }
    } else {
      player.resetDoubleRolls();
    }

    this.movePlayer(player, steps);
    this.handleTile(player);
    this.endTurn();
  }

  endTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    this.players[this.currentPlayerIndex].rollDoubleCount = 0;
    this.ui.updatePlayerPanel(this.players, this.currentPlayerIndex);
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
