class PlayerUI {
  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.element = this.createElement();
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'player-card';
    container.dataset.index = this.index;

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = this.name;

    const balanceEl = document.createElement('div');
    balanceEl.className = 'balance';
    balanceEl.textContent = '';

    container.append(nameEl, balanceEl);
    return container;
  }

  updateDisplay(balance) {
    const balanceElement = this.element.querySelector('.balance');
    if (balanceElement) {
      balanceElement.textContent = `${balance}₴`;
    }
  }

  setActive(isActive) {
    this.element.classList.toggle('active', isActive);
  }
}

export default PlayerUI;
