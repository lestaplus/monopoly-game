import BaseTile from './BaseTile.js';

class UtilityTile extends BaseTile {
  constructor(data) {
    super(data);
    this.utilityType = data.utilityType;
  }

  getOwnedUtilityCount(player) {
    return player.properties.filter((tile) => tile instanceof UtilityTile)
      .length;
  }

  rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return die1 + die2;
  }

  getRent(owner) {
    const utilityCount = this.getOwnedUtilityCount(owner);
    const multiplier = utilityCount === 2 ? 10 : 4;
    const dice = this.rollDice();
    return dice * multiplier;
  }

  async activate(player, players, context) {
    const modals = context.modals;

    if (!this.isOwned()) {
      await this.handleUnowned(player, players, modals);
      return;
    }

    if (this.owner !== player) {
      this.#handleRent(player);
      return;
    }

    console.log(`${player.name} вже володіє ${this.name}.`);
  }

  #handleRent(player) {
    const rent = this.getRent(this.owner);
    this.gameNotifier.message(
      `${player.name} сплачує ${rent}₴ за ${this.name} гравцю ${this.owner.name}.`,
    );
  }
}

export default UtilityTile;
