class GameUI {
  #players = [];
  #menu;

  constructor(menu) {
    this.#menu = menu;
  }

  addPlayer(player) {
    const panel = document.getElementById('player-list');
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
    const panel = document.getElementById('player-list');
    panel.innerHTML = '';
    this.#players = [];

    players.forEach((player) => {
      panel.appendChild(player.element);
      this.#players.push(player);
    });
  }
}

export default GameUI;
