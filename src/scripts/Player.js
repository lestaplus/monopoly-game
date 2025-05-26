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

  move(steps, boardLength) {
    this.#position = (this.#position + steps) % boardLength;
  }

  pay(amount) {
    this.#balance -= amount;
    this.ui.updateDisplay(this.#balance);
  }

  receive(amount) {
    this.#balance += amount;
    this.ui.updateDisplay(this.#balance);
  }

  incrementDoubleRolls() {
    this.#doubleRollsCount++;
  }

  resetDoubleRolls() {
    this.#doubleRollsCount = 0;
  }

  goToJail() {
    this.#position = 10;
    this.#inJail = true;
    this.#jailTurns = 0;
  }

  releaseFromJail() {
    this.#inJail = false;
    this.#jailTurns = 0;
  }

  rollDiceForJail() {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;

    alert(
      `${this.name} кидає кубики для виходу з в'язниці: ${firstDice} + ${secondDice}`,
    );
    return { firstDice, secondDice };
  }

  incrementJailTurns() {
    this.#jailTurns++;
  }

  useJailKey() {
    this.#hasJailKey = false;
    this.releaseFromJail();
  }

  shouldSkipTurn() {
    if (this.#skipTurn) {
      this.#skipTurn = false;
      return true;
    }
    return false;
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

  get position() {
    return this.#position;
  }

  set position(index) {
    this.#position = index;
  }

  get balance() {
    return this.#balance;
  }

  get doubleRollsCount() {
    return this.#doubleRollsCount;
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

  set skipTurn(value) {
    this.#skipTurn = value;
  }

  get properties() {
    return [...this.#properties];
  }

  get jailTurns() {
    return this.#jailTurns;
  }
}

export default Player;
