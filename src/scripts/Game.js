import Player from './Player.js';

class Game {
  #players = [];
  #currentPlayerIndex = 0;

  constructor(board, ui, cardManager) {
    this.board = board;
    this.ui = ui;
    this.cardManager = cardManager;
  }

  init(playersNames) {
    this.#players = playersNames.map((name, index) => {
      const player = new Player(name, index);
      this.ui.addPlayer(player);
      return player;
    });

    this.board.updatePlayerPositions(this.#players);
    this.ui.setDiceButtonHandler(() => this.handleRollDice());
    this.ui.setActivePlayer(this.#currentPlayerIndex);

    setTimeout(() => this.startTurn(), 0);
  }

  get players() {
    return [...this.#players];
  }

  get currentPlayer() {
    return this.#players[this.#currentPlayerIndex];
  }

  get currentPlayerIndex() {
    return this.#currentPlayerIndex;
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
      player.changeBalance(200);
      alert(
        `${player.name} проходить повз старт та отримує 200₴. Баланс: ${player.balance}₴`,
      );
    }

    alert(`${player.name} переміщується на позицію ${player.position}`);
    this.board.updatePlayerPositions(this.#players);
    player.updateDisplay();
  }

  startTurn() {
    const player = this.currentPlayer;

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

    this.ui.setActivePlayer(this.currentPlayerIndex);
    setTimeout(() => alert(`Хід гравця: ${player.name}`), 0);
    this.ui.enableButton('dice-btn');
  }

  handleTile(player, context = {}) {
    const initialPosition = player.position;
    const tile = this.board.tiles[initialPosition];

    alert(`${player.name} стоїть на клітинці ${tile.name}`);

    const localContext = {
      ...context,
      cardManager: this.cardManager,
      board: this.board,
      players: this.#players,
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
    const player = this.currentPlayer;
    const roll = this.rollDice();
    const { firstDice, secondDice, total: steps } = roll;

    if (firstDice === secondDice) {
      player.incrementDoubleRolls();

      if (player.doubleRollsCount >= 3) {
        alert(`${player.name} викинув 3 дублі поспіль і йде до в'язниці!`);
        player.goToJail();
        this.board.updatePlayerPositions(this.#players);
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
    this.#currentPlayerIndex =
      (this.#currentPlayerIndex + 1) % this.#players.length;
    this.ui.updatePlayers(this.players);
    this.ui.setActivePlayer(this.currentPlayerIndex);
    this.startTurn();
  }
}

export default Game;
