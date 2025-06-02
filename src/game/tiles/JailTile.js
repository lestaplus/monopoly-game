import BaseTile from './BaseTile.js';

class JailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const { modals } = context;

    if (!player.inJail) {
      await modals.messageModal.show({
        title: 'Екскурсія',
        message: `Ви відвідуєте в'язницю на екскурсії`,
      });

      this.gameNotifier.message(
        `${player.name} відвідує в'язницю на екскурсії.`,
      );
    }
  }
}

export default JailTile;
