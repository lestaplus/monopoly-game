class Menu {
  constructor() {
    this.menuElement = document.getElementById('menu');
    this.buttons = {};
  }

  init() {
    this.addButton('dice-btn', 'Кинути кубики');
    this.addButton('trade-btn', 'Торгівля');
  }

  addButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.innerText = text;
    button.disabled = true;
    this.menuElement.appendChild(button);
    this.buttons[id] = button;
  }

  setButtonHandler(id, callback) {
    if (this.buttons[id]) {
      this.buttons[id].onclick = callback;
    }
  }

  enableButton(id) {
    if (this.buttons[id]) {
      this.buttons[id].disabled = false;
    }
  }

  disableButton(id) {
    if (this.buttons[id]) {
      this.buttons[id].disabled = true;
    }
  }
}

export default Menu;
