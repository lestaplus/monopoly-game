import BaseTile from './BaseTile.js';

class TaxTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const modals = context.modals;
    await modals.messageModal.show({
      title: 'Податок',
      message: `Ви сплачуєте податок ${this.amount}₴`,
    });

    player.pay(this.amount);
    this.gameNotifier.message(
      `${player.name} сплачує податок ${this.amount}₴.`,
    );
  }
}

export default TaxTile;
