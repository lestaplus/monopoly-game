import BaseTile from './BaseTile.js';

class JailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player, players, context) {
    if (!player.inJail) {
      alert(`${player.name} просто відвідує в'язницю.`);
    }
  }
}

export default JailTile;
