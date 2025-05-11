import BaseTile from './baseTile.js';

class GoToJailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    player.goToJail();
    alert(`${player.name} відправляється до в'язниці!`);
  }
}

export default GoToJailTile;
