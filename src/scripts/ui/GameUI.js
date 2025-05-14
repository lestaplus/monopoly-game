class GameUI {
  #players = [];
  #menu;

  constructor(menu) {
    this.#menu = menu;
  }

  addPlayer(player) {
    const panel = document.getElementById('player-panel');
    if (panel && player.element) {
      panel.appendChild(player.element);
      this.#players.push(player);
    }
  }

  setActivePlayer(index) {
    this.#players.forEach((player, i) => {
      player.setActive(i === index);
    });
  }

  updatePlayers(players) {
    const panel = document.getElementById('player-panel');
    panel.innerHTML = '';
    this.#players = [];

    players.forEach((player) => {
      panel.appendChild(player.element);
      this.#players.push(player);
    });
  }

  setDiceButtonHandler(handler) {
    this.#menu.setButtonHandler('dice-btn', handler);
  }

  enableButton(id) {
    this.#menu.enableButton(id);
  }

  disableButton(id) {
    this.#menu.disableButton(id);
  }
}

export default GameUI;
