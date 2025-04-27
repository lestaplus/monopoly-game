class Menu {
  constructor() {
    this.rollButton = null;
  }

  init() {
    const menu = document.getElementById('menu');
    this.rollButton = document.createElement('button');
    this.rollButton.id = 'roll-dice';
    this.rollButton.innerText = 'Кинути кубики';
    this.rollButton.disabled = true;
    menu.appendChild(this.rollButton);
  }

  setRollHandler(callback) {
    if (this.rollButton) {
      this.rollButton.onclick = callback;
    }
  }

  enableRollButton() {
    if (this.rollButton) {
      this.rollButton.disabled = false;
    }
  }

  disableRollButton() {
    if (this.rollButton) {
      this.rollButton.disabled = true;
    }
  }
}

export default Menu;
