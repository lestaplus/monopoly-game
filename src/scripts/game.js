class Game {
  constructor(board) {
    this.board = board;
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  init(playersData) {
    this.players = playersData.map((name, index) => ({
      name,
      balance: 15000,
      position: 0,
      element: this.createPlayerElement(name, index),
    }));

    this.updatePlayerPanel();
  }

  createPlayerElement(name, index) {
    const playerElement = document.createElement('div');

    playerElement.className = 'player';
    playerElement.innerText = `Player: ${name}`;
    playerElement.dataset.index = index;

    return playerElement;
  }

  updatePlayerPanel() {
    const panel = document.getElementById('player-panel');
    panel.innerHTML = '';
    this.players.forEach((player) => {
      panel.appendChild(player.element);
    });
  }

  rollDice() {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;

    alert(`Випало ${firstDice} + ${secondDice} = $${firstDice + secondDice}`);
    return firstDice + secondDice;
  }

  movePlayer(player, steps) {
    player.position = (player.position + steps) % this.board.tiles.length;
    alert(`${player.name} переміщується на позицію ${player.position}`);
  }
}

export default Game;
