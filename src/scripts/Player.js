import PlayerUI from './ui/PlayerUI.js';
import GameNotifier from './ui/GameNotifier.js';

class Player {
  #balance = 1500;
  #position = 0;
  #properties = [];
  #inJail = false;
  #hasJailKey = false;
  #skipTurn = false;
  #doubleRollsCount = 0;
  #jailTurns = 0;

  constructor(name, index) {
    this.name = name;
    this.index = index;

    this.ui = new PlayerUI(name, index);
    this.element = this.ui.element;
    this.ui.updateDisplay(this.#balance);
    this.gameNotifier = GameNotifier.getInstance();
  }

  get position() {
    return this.#position;
  }

  set position(index) {
    this.#position = index;
  }

  move(steps, boardLength) {
    this.#position = (this.#position + steps) % boardLength;
  }

  get balance() {
    return this.#balance;
  }

  set balance(amount) {
    this.#balance = amount;
    this.ui.updateDisplay(this.#balance);
  }

  pay(amount) {
    this.#balance -= amount;
    this.ui.updateDisplay(this.#balance);
  }

  receive(amount) {
    this.#balance += amount;
    this.ui.updateDisplay(this.#balance);
  }

  get doubleRollsCount() {
    return this.#doubleRollsCount;
  }

  incrementDoubleRolls() {
    this.#doubleRollsCount++;
  }

  resetDoubleRolls() {
    this.#doubleRollsCount = 0;
  }

  get hasJailKey() {
    return this.#hasJailKey;
  }

  set hasJailKey(value) {
    this.#hasJailKey = value;
  }

  get inJail() {
    return this.#inJail;
  }

  goToJail() {
    this.#position = 10;
    this.#inJail = true;
    this.#jailTurns = 0;
  }

  tryExitJail() {
    if (this.#hasJailKey) {
      this.gameNotifier.message(
        `${this.name} використав ключ для виходу з в'язниці.`,
      );
      this.#hasJailKey = false;
      this.#inJail = false;
      this.#jailTurns = 0;
      return true;
    }

    const choice = prompt(
      `${this.name}, ви у в'язниці. Спробувати дубль (1) чи сплатити штраф 50₴ (2)`,
      '1',
    );

    if (choice === '2') {
      this.gameNotifier.message(
        `${this.name} сплатив штраф 50₴ і виходить з в'язниці`,
      );
      this.pay(50);
      this.#inJail = false;
      this.#jailTurns = 0;
      return true;
    }

    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;
    alert(
      `${this.name} кидає кубики для виходу з в'язниці: ${firstDice} + ${secondDice}`,
    );

    if (firstDice === secondDice) {
      this.gameNotifier.message(
        `${this.name} вибив дубль і виходить з в'язниці`,
      );
      this.#inJail = false;
      this.#jailTurns = 0;
      return true;
    }

    this.#jailTurns++;
    alert(`${this.name} не вибив дубль. Спроба ${this.#jailTurns}/3`);

    if (this.#jailTurns >= 3) {
      this.gameNotifier.message(
        `${this.name} не вибив дубль за 3 спроби. Сплачує 50₴`,
      );
      this.pay(50);
      this.#inJail = false;
      this.#jailTurns = 0;
      return true;
    }

    return false;
  }

  set skipTurn(value) {
    this.#skipTurn = value;
  }

  shouldSkipTurn() {
    if (this.#skipTurn) {
      this.#skipTurn = false;
      this.gameNotifier.message(`${this.name} пропускає хід`);
      return true;
    }
    return false;
  }

  get properties() {
    return [...this.#properties];
  }

  addProperty(property) {
    this.#properties.push(property);
  }

  removeProperty(property) {
    this.#properties = this.#properties.filter((p) => p !== property);
  }

  updateDisplay() {
    this.ui.updateDisplay(this.#balance);
  }

  setActive(isActive) {
    this.ui.setActive(isActive);
  }
}

export default Player;
