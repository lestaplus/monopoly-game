import BaseTile from './BaseTile.js';

class TaxTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    player.changeBalance(-this.amount);
    alert(
      `${player.name} сплачує податок ${this.amount}₴. Баланс: ${player.balance}₴`,
    );
  }
}

export default TaxTile;
