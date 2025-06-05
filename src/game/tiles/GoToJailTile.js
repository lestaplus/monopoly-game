import BaseTile from './BaseTile.js';

class GoToJailTile extends BaseTile {
  constructor(data, board) {
    super(data, board);
  }

  async activate(player, players, context) {
    const { modals } = context;
    await modals.messageModal.show({
      title: 'Арешт',
      message: `Ви відправляєтесь до в'язниці`,
    });

    player.goToJail();
    this.gameNotifier.message(`${player.name} відправляється до в'язниці!`);

    this.board.updatePlayerTokens(players);
  }
}

export default GoToJailTile;
