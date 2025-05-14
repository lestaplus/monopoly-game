import BaseTile from './BaseTile.js';
import { startAuction } from '../auction.js';

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

  activate(player, players) {
    if (!this.isOwned()) {
      const wantsToBuy = confirm(
        `${player.name}, хочеш купити ${this.name} за ${this.price}₴?`,
      );

      if (wantsToBuy) {
        if (player.balance >= this.price) {
          this.assignOwner(player, this.price);
          alert(
            `${player.name} купив ${this.name}. Баланс: ${player.balance}₴`,
          );
        } else {
          alert(`${player.name} не має достатньо грошей. Починаємо аукціон.`);
          startAuction(this, players);
        }
      } else {
        alert(`${player.name} не купив ${this.name}. Починаємо аукціон.`);
        startAuction(this, players);
      }
    } else if (this.owner !== player) {
      const rent = this.getRent(this.owner);
      alert(
        `${player.name} сплачує ${rent}₴ за оренду залізниці гравцю ${this.owner.name}. Баланс: ${player.balance}₴`,
      );
    } else {
      alert(`${player.name} вже володіє залізницею.`);
    }
  }
}

export default RailroadTile;
