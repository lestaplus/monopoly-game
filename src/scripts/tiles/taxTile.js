import BaseTile from './baseTile.js';

class TaxTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    player.setBalance(-this.amount);
    alert(
      `${player.name} сплачує податок ${this.amount}₴. Баланс: ${player.balance}₴`,
    );
  }
}

export default TaxTile;
