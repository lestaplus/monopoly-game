class BaseTile {
  constructor(data) {
    this.name = data.name;
    this.type = data.type;
    this.price = data.price;
    this.amount = data.amount;
    this.index = data.index;
    this.color = data.color;
    this.owner = null;
  }

  isOwned() {
    return !!this.owner;
  }

  setOwner(player) {
    this.owner = player;
    player.addProperty(this);
    player.setBalance(-this.price);
  }

  activate(player, players) {
    throw new Error(
      `Клітинка ${this.name}: метод activate() не використовується в базовому класі`,
    );
  }
}

export default BaseTile;
