import BaseTile from './BaseTile.js';

class StartTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const modals = context.modals;
    await modals.messageModal.show({
      title: 'Старт',
      message: `Ви стаєте на поле "${this.name}" та отримуєте 200₴`,
    });

    player.receive(200);
    this.gameNotifier.message(
      `${player.name} стає на поле "${this.name}" та отримує 200₴.`,
    );
  }
}

export default StartTile;
