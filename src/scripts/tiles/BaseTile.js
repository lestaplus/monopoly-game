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

  assignOwner(player, price) {
    this.#owner = player;
    player.addProperty(this);
    player.changeBalance(-price);
  }

  changeOwner(fromPlayer, toPlayer) {
    fromPlayer.removeProperty(this);
    toPlayer.addProperty(this);
    this.#owner = toPlayer;
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
