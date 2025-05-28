import BaseTile from './BaseTile.js';

class GoToJailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const modals = context.modals;
    await modals.messageModal.show({
      title: 'Арешт',
      message: `Ви відправляєтесь до в'язниці`,
    });

    player.goToJail();
    this.gameNotifier.message(`${player.name} відправляється до в'язниці!`);

    context.board.updatePlayerTokens(players);
  }
}

export default GoToJailTile;
