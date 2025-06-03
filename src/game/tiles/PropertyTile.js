import BaseTile from './BaseTile.js';

class PropertyTile extends BaseTile {
  #rentLevels;
  #buildingCost;
  #houses = 0;
  #hotel = false;

  constructor(data) {
    super(data);
    this.#rentLevels = data.rentLevels;
    this.#buildingCost = data.buildingCost;
  }

  getHouseCount() {
    return this.#hotel ? 5 : this.#houses;
  }

  getRent() {
    const baseRent = this.price * 0.1;
    const multiplier = this.#rentLevels[this.getHouseCount()] ?? 1;
    return Math.floor(baseRent * multiplier);
  }

  canBuyHouse(player) {
    if (
      this.owner !== player ||
      !this.hasSameColorTiles(player) ||
      this.getHouseCount() >= 4 ||
      player.balance < this.#buildingCost
    ) {
      return false;
    }

    const sameTiles = this.getSameColorTiles(player);

    const anyMortgaged = sameTiles.some((tile) => tile.mortgaged);
    if (anyMortgaged) {
      return false;
    }

    const minHouses = Math.min(
      ...sameTiles.map((tile) => tile.getHouseCount()),
    );

    return this.getHouseCount() === minHouses;
  }

  buyHouse(player) {
    if (this.canBuyHouse(player)) {
      this.#houses++;
      player.pay(this.buildingCost);
      console.log('Buying House');
      return true;
    }
    return false;
  }

  canSellHouse(player) {
    if (this.owner !== player || this.#houses === 0) {
      return false;
    }

    const sameTiles = this.getSameColorTiles(player);

    const houseCounts = sameTiles.map((tile) => {
      let houses = tile.getHouseCount();
      if (tile === this) {
        return houses - 1;
      }
      return houses;
    });

    const minHouses = Math.min(...houseCounts);
    const maxHouses = Math.max(...houseCounts);

    return maxHouses - minHouses <= 1;
  }

  sellHouse(player) {
    if (this.canSellHouse(player)) {
      this.#houses--;
      player.receive(Math.floor(this.buildingCost / 2));
      console.log('Selling House');
      return true;
    }
    return false;
  }

  canBuyHotel(player) {
    if (
      this.owner !== player ||
      this.#hotel ||
      player.balance < this.#buildingCost
    ) {
      return false;
    }

    const sameTiles = this.getSameColorTiles(player);

    const anyMortgaged = sameTiles.some((tile) => tile.mortgaged);
    if (anyMortgaged) {
      return false;
    }

    return sameTiles.every((tile) => tile.#hotel || tile.getHouseCount() === 4);
  }

  buyHotel(player) {
    if (this.canBuyHotel(player)) {
      this.#hotel = true;
      this.#houses = 0;
      player.pay(this.buildingCost);
      console.log('Buying Hotel');
      return true;
    }
    return false;
  }

  canSellHotel(player) {
    if (this.owner !== player || !this.#hotel) {
      return false;
    }

    const sameTiles = this.getSameColorTiles(player);
    return sameTiles.every((tile) => tile.#hotel || tile.getHouseCount() === 4);
  }

  sellHotel(player) {
    if (this.canSellHotel(player)) {
      this.#hotel = false;
      this.#houses = 4;
      player.receive(Math.floor(this.buildingCost / 2));
      console.log('Selling Hotel');
      return true;
    }
    return false;
  }

  getSameColorTiles(player) {
    return player.properties.filter((tile) => tile.color === this.color);
  }

  hasSameColorTiles(player) {
    const sameColorTiles = this.getSameColorTiles(player);
    const requiredCount = PropertyTile.colorGroups[this.color];
    return sameColorTiles.length === requiredCount;
  }

  canMortgage(player) {
    if (
      this.owner !== player ||
      this.mortgaged ||
      this.houses > 0 ||
      this.hotel
    ) {
      return false;
    }

    const sameTiles = this.getSameColorTiles(player);
    const anyBuildings = sameTiles.some(
      (tile) => tile.houses > 0 || tile.hotel,
    );

    return !anyBuildings;
  }

  async activate(player, players, context) {
    if (!this.isOwned()) {
      await this.handleUnowned(player, players, context);
      return;
    }

    if (this.owner !== player) {
      await this.handleRentPayment(player, context);
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

  get rentLevels() {
    return this.#rentLevels;
  }

  get buildingCost() {
    return this.#buildingCost;
  }

  get houses() {
    return this.#houses;
  }

  get hotel() {
    return this.#hotel;
  }
}

export default PropertyTile;
