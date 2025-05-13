import BaseTile from './BaseTile.js';
import { startAuction } from '../auction.js';

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

  activate(player, players) {
    if (!this.isOwned()) {
      const wantsToBuy = confirm(
        `${player.name}, хочеш купити ${this.name} за ${this.price}₴?`,
      );

      if (wantsToBuy) {
        if (player.balance >= this.price) {
          this.setOwner(player);
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
        `${player.name} сплачує ${rent}₴ за ${this.name} гравцю ${this.owner.name}. Баланс: ${player.balance}₴`,
      );
    } else {
      alert(`${player.name} вже володіє ${this.name}.`);
    }
  }
}

export default UtilityTile;
