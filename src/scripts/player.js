class Player {
  constructor(name, index) {
    this.name = name;
    this.balance = 15000;
    this.position = 0;
    this.properties = [];
    this.element = this.createPlayerElement(name, index);
  }

  createPlayerElement(name, index) {
    const playerElement = document.createElement('div');

    playerElement.className = 'player';
    playerElement.innerText = `Player: ${name}`;
    playerElement.dataset.index = index;

    return playerElement;
  }

  move(steps, boardLength) {
    this.position = (this.position + steps) % boardLength;
  }

  setBalance(amount) {
    this.balance += amount;
  }

  addProperty(property) {
    this.properties.push(property);
  }
}

export default Player;
