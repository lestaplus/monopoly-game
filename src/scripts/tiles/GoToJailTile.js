import BaseTile from './BaseTile.js';

class GoToJailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player, players, context) {
    this.gameNotifier.message(`${player.name} відправляється до в'язниці!`);
    player.goToJail();

    context.board.updatePlayerPositions(players);
  }
}

export default GoToJailTile;
