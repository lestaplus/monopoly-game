import BaseTile from './BaseTile.js';

class RailroadTile extends BaseTile {
  constructor(data) {
    super(data);
    this.rentMap = data.rentMap;
  }

  getOwnedRailroadsCount(player) {
    return player.properties.filter((tile) => tile instanceof RailroadTile)
      .length;
  }

  getRent(owner) {
    const count = this.getOwnedRailroadsCount(owner);
    return this.rentMap[count];
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

    console.log(`${player.name} вже володіє залізницею.`);
  }

  #handleRent(player) {
    const rent = this.getRent(this.owner);
    console.log(
      `${player.name} сплачує ${rent}₴ за оренду залізниці гравцю ${this.owner.name}. Баланс: ${player.balance}₴`,
    );
  }
}

export default RailroadTile;
