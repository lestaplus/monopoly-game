import GameNotifier from '../../ui/services/GameNotifier.js';

class BaseTile {
  #name;
  #type;
  #price;
  #amount;
  #index;
  #color;
  #owner = null;
  #mortgaged = false;

  constructor(data, board) {
    this.#name = data.name;
    this.#type = data.type;
    this.#price = data.price;
    this.#amount = data.amount;
    this.#index = data.index;
    this.#color = data.color;

    this.board = board;

    this.gameNotifier = GameNotifier.getInstance();
  }

  isOwned() {
    return !!this.#owner;
  }

  assignOwner(player) {
    this.#owner = player;
    player.addProperty(this);

    const tileRenderer = this.board.renderer.getTileRendererByIndex(this.index);
    if (tileRenderer) {
      tileRenderer.updateOwnership(player);
    }
  }

  changeOwner(fromPlayer, toPlayer) {
    fromPlayer.removeProperty(this);
    toPlayer.addProperty(this);
    this.#owner = toPlayer;

    const tileRenderer = this.board.renderer.getTileRendererByIndex(this.index);
    if (tileRenderer) {
      tileRenderer.updateOwnership(toPlayer);
    }
  }

  removeOwner() {
    if (this.#owner) {
      this.#owner.removeProperty(this);
      this.clearOwner();
      this.clearMortgage();

      const tileRenderer = this.board.renderer.getTileRendererByIndex(
        this.index,
      );
      if (tileRenderer) {
        tileRenderer.updateOwnership(null);
      }
    }
  }

  clearOwner() {
    this.#owner = null;
  }

  clearMortgage() {
    this.#mortgaged = false;
  }

  canMortgage(player) {
    return this.#owner === player && !this.#mortgaged;
  }

  mortgage(player) {
    if (this.canMortgage(player)) {
      this.#mortgaged = true;
      console.log('tile mortgage');
      player.receive(Math.floor(this.#price / 2));
      return true;
    }
    return false;
  }

  canRedeem(player) {
    if (this.#owner !== player || !this.#mortgaged) {
      return false;
    }

    const repayAmount = Math.floor((this.#price / 2) * 1.1);
    return player.balance >= repayAmount;
  }

  redeem(player) {
    if (this.canRedeem(player)) {
      const repayAmount = Math.floor((this.#price / 2) * 1.1);
      player.pay(repayAmount);
      this.#mortgaged = false;
      console.log('tile redeem');
      return true;
    }
    return false;
  }

  async handleUnowned(player, players, context) {
    const { modals, auction } = context;
    const choice = await modals.purchaseModal.show(this);

    if (choice === 'buy') {
      if (player.balance >= this.price) {
        this.assignOwner(player);
        player.pay(this.price);
        this.gameNotifier.message(`${player.name} купує поле "${this.name}".`);
      } else {
        await modals.noFundsModal.show();
        this.gameNotifier.message(
          `${player.name} не має достатньо грошей, щоб купити поле "${this.name}". Стартує аукціон!`,
        );
        await auction.start(this, players);
      }
    } else if (choice === 'auction') {
      this.gameNotifier.message(
        `${player.name} не купує поле "${this.name}". Стартує аукціон!`,
      );
      await auction.start(this, players);
    }
  }

  async handleRentPayment(player, context) {
    if (this.mortgaged) {
      return;
    }

    const { modals } = context;
    const rent = await this.getRent(context);

    await modals.messageModal.show({
      title: 'Оренда',
      message: `Ви сплачуєте ${rent}₴ за оренду поля "${this.name}" гравцю ${this.owner.name}`,
    });

    player.pay(rent);
    this.owner.receive(rent);
    this.gameNotifier.message(
      `${player.name} сплачує ${rent}₴ за оренду поля "${this.name}" гравцю ${this.owner.name}.`,
    );
  }

  activate(player, players, context) {
    throw new Error(
      `Клітинка ${this.#name}: метод activate() не використовується в базовому класі`,
    );
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get price() {
    return this.#price;
  }

  get amount() {
    return this.#amount;
  }

  get index() {
    return this.#index;
  }

  get color() {
    return this.#color;
  }

  get owner() {
    return this.#owner;
  }

  get mortgaged() {
    return this.#mortgaged;
  }
}

export default BaseTile;
