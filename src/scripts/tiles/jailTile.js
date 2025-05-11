import BaseTile from './baseTile.js';

class JailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    alert(`${player.name} просто відвідує в'язницю.`);
  }
}

export default JailTile;
