import BaseTile from './BaseTile.js';
import { startAuction } from '../auction.js';

class PropertyTile extends BaseTile {
  constructor(data) {
    super(data);
    this.rentLevels = data.rentLevels;
    this.buildingCost = data.buildingCost;
    this.houses = 0;
    this.hotel = false;
  }

  getRent() {
    const baseRent = this.price * 0.1;
    const multIndex = this.hotel ? 5 : this.houses;
    const multiplier = this.rentLevels[multIndex] ?? 1;
    return Math.floor(baseRent * multiplier);
  }

  canBuyHouse(player) {
    return (
      this.owner === player &&
      this.hasSameColorTiles(player) &&
      this.houses < 4 &&
      !this.hotel &&
      player.balance >= this.buildingCost
    );
  }

  buyHouse(player) {
    if (this.canBuyHouse(player)) {
      this.houses++;
      player.changeBalance(-this.buildingCost);
    }
  }

  canBuyHotel(player) {
    return (
      this.owner === player &&
      this.houses === 4 &&
      !this.hotel &&
      player.balance >= this.buildingCost
    );
  }

  buyHotel(player) {
    if (this.canBuyHotel(player)) {
      this.hotel = true;
      this.houses = 0;
      player.changeBalance(-this.buildingCost);
    }
  }

  hasSameColorTiles(player) {
    const sameColorTiles = player.properties.filter(
      (tile) => tile.color === this.color,
    );

    const requiredCount = PropertyTile.colorGroups[this.color];
    return sameColorTiles.length === requiredCount;
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
      const rent = this.getRent();
      player.changeBalance(-rent);
      this.owner.changeBalance(rent);
      alert(
        `${player.name} сплачує ${rent}₴ за оренду власності гравцю ${this.owner.name}. Баланс: ${player.balance}₴`,
      );
    } else {
      if (this.canBuyHotel(player)) {
        const upgrade = confirm(
          `У тебе є 4 будинки. Побудувати готель за ${this.buildingCost}₴?`,
        );
        if (upgrade) this.buyHotel(player);
      } else if (this.canBuyHouse(player)) {
        const build = confirm(`Побудувати будинок за ${this.buildingCost}₴?`);
        if (build) this.buyHouse(player);
      } else {
        alert(`${player.name} вже володіє ${this.name}.`);
      }
    }
  }

  static colorGroups = {
    brown: 2,
    blue: 2,
    pink: 3,
    purple: 3,
    orange: 3,
    red: 3,
    yellow: 3,
    green: 3,
  };
}

export default PropertyTile;
