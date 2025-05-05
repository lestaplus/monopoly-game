class Player {
  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.balance = 15000;
    this.position = 0;
    this.properties = [];
    this.createElement();
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'player-card';
    container.dataset.index = this.index;

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = this.name;

    const balance = document.createElement('div');
    balance.className = 'balance';
    balance.textContent = `${this.balance}₴`;

    container.append(name, balance);
    this.element = container;
  }

  move(steps, boardLength) {
    this.position = (this.position + steps) % boardLength;
  }

  setBalance(amount) {
    this.balance += amount;
    this.updateDisplay();
  }

  addProperty(property) {
    this.properties.push(property);
  }

  updateDisplay() {
    const balanceElement = this.element.querySelector('.balance');
    if (balanceElement) {
      balanceElement.textContent = `${this.balance}₴`;
    }
  }

  setActive(isActive) {
    this.element.classList.toggle('active', isActive);
  }
}

export default Player;
