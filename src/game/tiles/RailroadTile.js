import BaseTile from './BaseTile.js';

class RailroadTile extends BaseTile {
  #rentMap;

  constructor(data, board) {
    super(data, board);
    this.#rentMap = data.rentMap;
  }

  getOwnedRailroadsCount(player) {
    return player.properties.filter((tile) => tile instanceof RailroadTile)
      .length;
  }

  getRent() {
    const count = this.getOwnedRailroadsCount(this.owner);
    return this.#rentMap[count];
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

    console.log(`${player.name} вже володіє залізницею.`);
  }

  get rentMap() {
    return this.#rentMap;
  }
}

export default RailroadTile;
