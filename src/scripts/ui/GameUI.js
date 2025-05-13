class GameUI {
  constructor(menu) {
    this.menu = menu;
  }

  setDiceButtonHandler(handler) {
    this.menu.setButtonHandler('dice-btn', handler);
  }

  enableDiceButton() {
    this.menu.enableButton('dice-btn');
  }

  updatePlayerPanel(players, currentPlayerIndex) {
    const panel = document.getElementById('player-panel');
    panel.innerHTML = '';
    players.forEach((player, index) => {
      player.setActive(index === currentPlayerIndex);
      panel.appendChild(player.element);
    });
  }
}

export default GameUI;
