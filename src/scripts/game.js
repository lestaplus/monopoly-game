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
  }

  createPlayerElement(name, index) {
    const playerElement = document.createElement('div');

    playerElement.className = 'player';
    playerElement.innerText = `Player: ${name}`;
    playerElement.dataset.index = index;

    return playerElement;
  }
}
