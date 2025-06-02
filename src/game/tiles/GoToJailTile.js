import BaseTile from './BaseTile.js';

class GoToJailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const { board, modals } = context;
    await modals.messageModal.show({
      title: 'Арешт',
      message: `Ви відправляєтесь до в'язниці`,
    });

    player.goToJail();
    this.gameNotifier.message(`${player.name} відправляється до в'язниці!`);

    board.updatePlayerTokens(players);
  }
}

export default GoToJailTile;
