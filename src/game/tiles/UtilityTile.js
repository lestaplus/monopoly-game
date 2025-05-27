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

  getRent() {
    const utilityCount = this.getOwnedUtilityCount(this.owner);
    const multiplier = utilityCount === 2 ? 10 : 4;
    const dice = this.rollDice();
    return dice * multiplier;
  }

  async activate(player, players, context) {
    if (!this.isOwned()) {
      await this.handleUnowned(player, players, context);
      return;
    }

    if (this.owner !== player) {
      await this.handleRentPayment(player, context);
      return;
    }

    console.log(`${player.name} вже володіє ${this.name}.`);
  }
}

export default UtilityTile;
