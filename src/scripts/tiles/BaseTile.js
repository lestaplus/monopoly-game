import { startAuction } from '../auction.js';
import GameNotifier from '../ui/GameNotifier.js';

class BaseTile {
  #name;
  #type;
  #price;
  #amount;
  #index;
  #color;
  #owner = null;

  constructor(data) {
    this.#name = data.name;
    this.#type = data.type;
    this.#price = data.price;
    this.#amount = data.amount;
    this.#index = data.index;
    this.#color = data.color;

    this.gameNotifier = GameNotifier.getInstance();
  }

  isOwned() {
    return !!this.#owner;
  }

  assignOwner(player) {
    this.#owner = player;
    player.addProperty(this);
  }

  changeOwner(fromPlayer, toPlayer) {
    fromPlayer.removeProperty(this);
    toPlayer.addProperty(this);
    this.#owner = toPlayer;
  }

  async handleUnowned(player, players, context) {
    const { modals, ui } = context;
    const choice = await modals.purchaseModal.show(this);

    if (choice === 'buy') {
      if (player.balance >= this.price) {
        this.assignOwner(player);
        player.pay(this.price);
        this.gameNotifier.message(`${player.name} купив ${this.name}.`);
      } else {
        await modals.noFundsModal.show();
        this.gameNotifier.message(
          `${player.name} не має достатньо грошей. Починаємо аукціон.`,
        );
        await startAuction(this, players, ui);
      }
    } else if (choice === 'auction') {
      this.gameNotifier.message(
        `${player.name} не купив ${this.name}. Починаємо аукціон.`,
      );
      await startAuction(this, players, ui);
    }
  }

  activate(player, players) {
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
}

export default BaseTile;
