import BaseTile from './BaseTile.js';

class StartTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    player.receive(200);
    this.gameNotifier.message(
      `${player.name} стає на клітинку Старт та отримує 200₴.`,
    );
  }
}

export default StartTile;
