import BaseTile from './BaseTile.js';

class UtilityTile extends BaseTile {
  #utilityType;

  constructor(data) {
    super(data);
    this.#utilityType = data.utilityType;
  }

  getOwnedUtilityCount(player) {
    return player.properties.filter((tile) => tile instanceof UtilityTile)
      .length;
  }

  async getRent(context) {
    const { modals } = context;
    const { dice1, dice2 } = await modals.diceModal.show(
      'Кидаємо кубики для оренди...',
    );
    const total = dice1 + dice2;

    const utilityCount = this.getOwnedUtilityCount(this.owner);
    const multiplier = utilityCount === 2 ? 10 : 4;

    return total * multiplier;
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

  get utilityType() {
    return this.#utilityType;
  }
}

export default UtilityTile;
