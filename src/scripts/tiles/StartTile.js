import BaseTile from './BaseTile.js';

class StartTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    player.setBalance(200);
    alert(
      `${player.name} стає на клітинку Старт та отримує 200₴. Баланс: ${player.balance}₴`,
    );
  }
}

export default StartTile;
