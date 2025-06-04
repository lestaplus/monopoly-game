import Player from './Player.js';
import GameNotifier from '../ui/services/GameNotifier.js';
import Auction from './Auction.js';

class Game {
  #players = [];
  #currentPlayerIndex = 0;
  #bankruptcyModalOpen = false;
  #balanceHandlers = new Map();
  #gameOver = false;

  constructor(board, ui, modalService) {
    this.board = board;
    this.ui = ui;
    this.modalService = modalService;
    this.auction = new Auction(modalService);
    this.gameNotifier = GameNotifier.getInstance();
  }

  init(playersNames) {
    this.#players = playersNames.map((name, index) => {
      const player = new Player(name, index);
      this.ui.addPlayer(player);

      const balanceHandler = (player) => this.handleNegativeBalance(player);
      player.events.on('negativeBalance', balanceHandler);
      this.#balanceHandlers.set(player, balanceHandler);

      return player;
    });

    this.board.updatePlayerTokens(this.players);
    this.ui.setActivePlayer(this.currentPlayerIndex);
  }

  async startGame() {
    await this.#startTurn();
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

    console.log(`${player.name} переміщується на позицію ${player.position}`);
    this.board.updatePlayerTokens(this.players);
    player.updateDisplay();
  }

  async #startTurn(fromDoubleRoll = false) {
    if (this.#gameOver) return;

    const player = this.currentPlayer;

    if (player.bankrupt) {
      await this.#endTurn();
      return;
    }

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

    if (fromDoubleRoll) {
      this.gameNotifier.message(`${player.name} ходить ще раз після дубля.`);
    }

    this.ui.setActivePlayer(this.currentPlayerIndex);
    const { dice1: firstDice, dice2: secondDice } =
      await this.modalService.turnModal.show(player, fromDoubleRoll);
    await this.#handleRollDice(firstDice, secondDice);
  }

  async #handleJail(player) {
    const choice = await this.modalService.jailModal.show(player);

    switch (choice) {
      case 'key':
        return this.#handleJailKey(player);
      case 'pay':
        return this.#handleJailPay(player);
      case 'roll':
        return await this.#handleJailRoll(player);
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

  async #handleJailPay(player) {
    this.gameNotifier.message(
      `${player.name} сплачує штраф 50₴ і виходить з в'язниці.`,
    );

    player.pay(50, { emitEvents: false });

    if (player.balance < 0 && !player.bankrupt) {
      await this.handleNegativeBalance(player, { endTurnAfter: false });
    }

    if (player.bankrupt) {
      return false;
    }

    player.releaseFromJail();
    return true;
  }

  async #handleJailRoll(player) {
    const { dice1: firstDice, dice2: secondDice } =
      await this.modalService.diceModal.show("Кидаємо кубики з в'язниці...");

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

      console.log(`${player.name} стоїть на клітинці ${currentTile.name}`);

      await currentTile.activate(player, this.players, {
        board: this.board,
        modals: this.modalService,
        auction: this.auction,
      });

      if (player.position !== previousPosition) {
        this.board.updatePlayerTokens(this.players);
      }
      moved = player.position !== previousPosition;
    } while (moved);
  }

  async #handleRollDice(firstDice, secondDice) {
    const player = this.currentPlayer;
    const steps = firstDice + secondDice;

    if (firstDice === secondDice) {
      player.incrementDoubleRolls();

      if (player.doubleRollsCount === 3) {
        this.gameNotifier.message(
          `${player.name} вибиває 3 дублі поспіль і йде до в'язниці!`,
        );
        player.goToJail();
        player.resetDoubleRolls();
        this.board.updatePlayerTokens(this.players);
        await this.#endTurn();
        return;
      } else {
        this.gameNotifier.message(
          `${player.name} вибиває дубль та отримує додатковий хід.`,
        );
        this.movePlayer(player, steps);
        await this.#handleTile(player);

        if (this.#bankruptcyModalOpen || player.bankrupt) {
          return;
        }

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

    if (this.#bankruptcyModalOpen || player.bankrupt) {
      return;
    }

    await this.#endTurn();
  }

  async handleBankruptcy(player) {
    player.declareBankruptcy();
    this.#removePlayer(player);

    if (this.players.length === 1) {
      await this.#handleVictory(this.players[0]);
      return;
    }

    this.gameNotifier.message(
      `${player.name} оголошує банкрутство та виходить з гри.`,
    );
    this.ui.updatePlayers(this.players);
    this.ui.setActivePlayer(this.#currentPlayerIndex);
    await this.#startTurn();
  }

  async handleNegativeBalance(player, { endTurnAfter = true } = {}) {
    if (player.bankrupt || this.#bankruptcyModalOpen) return;

    this.#bankruptcyModalOpen = true;

    const choice = await this.modalService.bankruptcyModal.show(player);

    this.#bankruptcyModalOpen = false;

    if (choice === 'surrender') {
      await this.handleBankruptcy(player);
      await this.#endTurn();
    } else if (choice === 'continue') {
      player.clearBankruptcy();
      this.gameNotifier.message(
        `${player.name} покриває борг та продовжує гру.`,
      );

      if (endTurnAfter) {
        const playerHadDouble = player.doubleRollsCount > 0;
        if (playerHadDouble) {
          await this.#startTurn(true);
        } else {
          await this.#endTurn();
        }
      }
    }
  }

  async #endTurn() {
    if (this.#bankruptcyModalOpen || this.#gameOver) return;

    this.modalService.modalManager.clearStack();

    do {
      this.#currentPlayerIndex =
        (this.#currentPlayerIndex + 1) % this.#players.length;
    } while (this.currentPlayer.bankrupt);

    this.ui.updatePlayers(this.players);
    this.ui.setActivePlayer(this.currentPlayerIndex);
    await this.#startTurn();
  }

  #removePlayer(player) {
    const removedIndex = this.#players.indexOf(player);
    if (removedIndex === -1) return;

    player.properties.forEach((property) => {
      property.removeOwner();

      const tileRenderer = this.board.renderer.getTileRendererByIndex(
        property.index,
      );
      if (tileRenderer) {
        tileRenderer.updateBuildings();
        tileRenderer.updateMortgageStatus();
      }
    });

    player.ui.removePlayerCard();
    this.board.removePlayerToken(player);

    const balanceHandler = this.#balanceHandlers.get(player);
    if (balanceHandler) {
      player.events.off('negativeBalance', balanceHandler);
      this.#balanceHandlers.delete(player);
    }

    this.#players = this.#players.filter((p) => p !== player);

    if (removedIndex < this.#currentPlayerIndex) {
      this.#currentPlayerIndex--;
    }

    if (this.#currentPlayerIndex >= this.#players.length) {
      this.#currentPlayerIndex = 0;
    }
  }

  async #handleVictory(winner) {
    this.gameNotifier.message(`${winner.name} перемагає у грі!`);
    this.#gameOver = true;
    await this.modalService.messageModal.show({
      title: 'Перемога!',
      message: `${winner.name} виграє гру! Вітаємо!`,
    });
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
