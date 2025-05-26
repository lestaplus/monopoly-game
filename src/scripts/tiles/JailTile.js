import BaseTile from './BaseTile.js';

class JailTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player, players, context) {
    if (!player.inJail) {
      this.gameNotifier.message(
        `${player.name} відвідує в'язницю на екскурсії.`,
      );
    }
  }
}

export default JailTile;
