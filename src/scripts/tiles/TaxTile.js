import BaseTile from './BaseTile.js';

class TaxTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    player.changeBalance(-this.amount);
    this.gameNotifier.message(
      `${player.name} сплачує податок ${this.amount}₴.`,
    );
  }
}

export default TaxTile;
