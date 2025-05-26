import Player from './Player.js';
import GameNotifier from './ui/GameNotifier.js';

class Game {
  #players = [];
  #currentPlayerIndex = 0;

  constructor(board, ui, modalService) {
    this.board = board;
    this.ui = ui;
    this.modalService = modalService;
    this.gameNotifier = GameNotifier.getInstance();
  }

  init(playersNames) {
    this.#players = playersNames.map((name, index) => {
      const player = new Player(name, index);
      this.ui.addPlayer(player);
      return player;
    });

    this.board.updatePlayerPositions(this.#players);
    this.ui.setActivePlayer(this.#currentPlayerIndex);
  }

  async startGame() {
    await this.#startTurn();
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
      player.receive(200);
      this.gameNotifier.message(
        `${player.name} проходить повз "Старт" та отримує 200₴.`,
      );
    }

    alert(`${player.name} переміщується на позицію ${player.position}`);
    this.board.updatePlayerPositions(this.#players);
    player.updateDisplay();
  }

  async #startTurn(fromDoubleRoll = false) {
    const player = this.currentPlayer;

    if (!fromDoubleRoll && player.shouldSkipTurn()) {
      this.gameNotifier.message(`${player.name} пропускає хід.`);
      await this.#endTurn();
      return;
    }

    if (player.inJail) {
      const freed = await this.#handleJail(player);

      if (!freed) {
        await this.#endTurn();
        return;
      }
    }

    this.ui.setActivePlayer(this.currentPlayerIndex);
    await this.modalService.turnModal.show(player);
    await this.#handleRollDice();
  }

  async #handleJail(player) {
    const choice = await this.modalService.jailModal.show(player);

    switch (choice) {
      case 'key':
        return this.#handleJailKey(player);
      case 'pay':
        return this.#handleJailPay(player);
      case 'roll':
        return this.#handleJailRoll(player);
      default:
        return false;
    }
  }

  #handleJailKey(player) {
    if (!player.hasJailKey) {
      this.gameNotifier.message(
        `${player.name} намагається використати ключ якого не існує. Хід втрачається.`,
      );
      player.incrementJailTurns();

      if (player.jailTurns === 3) {
        this.gameNotifier.message(
          `${player.name} не виходить з в'язниці за 3 спроби та сплачує штраф 50₴.`,
        );
        player.pay(50);
        player.releaseFromJail();
        return true;
      }

      return false;
    }

    this.gameNotifier.message(
      `${player.name} використовує ключ для виходу з в'язниці.`,
    );
    player.useJailKey();
    return true;
  }

  #handleJailPay(player) {
    this.gameNotifier.message(
      `${player.name} сплачує штраф 50₴ і виходить з в'язниці.`,
    );
    player.pay(50);
    player.releaseFromJail();
    return true;
  }

  #handleJailRoll(player) {
    const { firstDice, secondDice } = player.rollDiceForJail();

    if (firstDice === secondDice) {
      this.gameNotifier.message(
        `${player.name} вибиває дубль і виходить з в'язниці.`,
      );
      player.releaseFromJail();
      return true;
    }

    player.incrementJailTurns();

    if (player.jailTurns === 3) {
      this.gameNotifier.message(
        `${player.name} не вибиває дубль за 3 спроби та сплачує штраф 50₴.`,
      );
      player.pay(50);
      player.releaseFromJail();
      return true;
    } else {
      this.gameNotifier.message(
        `${player.name} не вибиває дубль. Спроба ${player.jailTurns} з 3.`,
      );
    }

    return false;
  }

  async #handleTile(player) {
    let currentTile;
    let moved;

    do {
      const previousPosition = player.position;
      currentTile = this.board.tiles[previousPosition];

      alert(`${player.name} стоїть на клітинці ${currentTile.name}`);

      await currentTile.activate(player, this.players, {
        board: this.board,
        players: this.#players,
        game: this,
        modals: this.modalService,
        ui: this.ui,
      });

      if (player.position !== previousPosition) {
        this.board.updatePlayerPositions(this.players);
      }
      moved = player.position !== previousPosition;
    } while (moved);
  }

  async #handleRollDice() {
    const player = this.currentPlayer;
    const { firstDice, secondDice, total: steps } = this.rollDice();

    if (firstDice === secondDice) {
      player.incrementDoubleRolls();

      if (player.doubleRollsCount === 3) {
        this.gameNotifier.message(
          `${player.name} вибиває 3 дублі поспіль і йде до в'язниці!`,
        );
        player.goToJail();
        player.resetDoubleRolls();
        this.board.updatePlayerPositions(this.#players);
        await this.#endTurn();
        return;
      } else {
        this.gameNotifier.message(
          `${player.name} вибиває дубль і ходить ще раз.`,
        );
        this.movePlayer(player, steps);
        await this.#handleTile(player);

        if (player.inJail) {
          await this.#endTurn();
          return;
        }

        await this.#startTurn(true);
        return;
      }
    } else {
      player.resetDoubleRolls();
    }

    this.movePlayer(player, steps);
    await this.#handleTile(player);
    await this.#endTurn();
  }

  async #endTurn() {
    this.modalService.modalManager.clearStack();
    this.#currentPlayerIndex =
      (this.#currentPlayerIndex + 1) % this.#players.length;
    this.ui.updatePlayers(this.players);
    this.ui.setActivePlayer(this.currentPlayerIndex);
    await this.#startTurn();
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
}

export default Game;
