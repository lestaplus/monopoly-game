import BaseTile from './BaseTile.js';

class ParkingTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const modals = context.modals;
    await modals.messageModal.show({
      title: 'Безкоштовна стоянка',
      message: `Ви відпочиваєте на безкоштовній стоянці`,
    });

    this.gameNotifier.message(
      `${player.name} відпочиває на безкоштовній стоянці.`,
    );
  }
}

export default ParkingTile;
