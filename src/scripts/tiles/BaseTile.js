import { startAuction } from '../auction.js';

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

  async handleUnowned(player, players, modals) {
    const choice = await modals.purchaseModal.show(this);

    if (choice === 'buy') {
      if (player.balance >= this.price) {
        this.assignOwner(player);
        player.changeBalance(-this.price);
        console.log(
          `${player.name} купив ${this.name}. Баланс: ${player.balance}₴`,
        );
      } else {
        await modals.noFundsModal.show();
        console.log(
          `${player.name} не має достатньо грошей. Починаємо аукціон.`,
        );
        await startAuction(this, players);
      }
    } else if (choice === 'auction') {
      console.log(`${player.name} не купив ${this.name}. Починаємо аукціон.`);
      await startAuction(this, players);
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
