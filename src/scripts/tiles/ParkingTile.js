import BaseTile from './BaseTile.js';

class ParkingTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    this.gameNotifier.message(
      `${player.name} відпочиває на безкоштовній стоянці.`,
    );
  }
}

export default ParkingTile;
