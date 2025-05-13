import BaseTile from './BaseTile.js';

class GoToJailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player, players, context) {
    alert(`${player.name} відправляється до в'язниці!`);
    player.goToJail();

    context.board.updatePlayerPositions(players);
  }
}

export default GoToJailTile;
