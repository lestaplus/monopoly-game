import PlayerUI from '../ui/PlayerUI.js';
import GameNotifier from '../ui/services/GameNotifier.js';
import EventEmitter from '../utils/EventEmitter.js';

class Player {
  #balance = 1500;
  #position = 0;
  #properties = [];
  #inJail = false;
  #hasJailKey = false;
  #skipTurn = false;
  #doubleRollsCount = 0;
  #jailTurns = 0;
  #bankrupt = false;

  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.events = new EventEmitter();

    this.ui = new PlayerUI(name, index);
    this.element = this.ui.element;
    this.ui.updateDisplay(this.balance);
    this.gameNotifier = GameNotifier.getInstance();
  }

  move(steps, boardLength) {
    this.#position = (this.#position + steps) % boardLength;
  }

  pay(amount, { emitEvents = true } = {}) {
    this.#balance -= amount;
    this.updateDisplay();
    if (emitEvents) {
      this.events.emit('balanceChange', this.balance);

      if (this.#balance < 0 && !this.bankrupt) {
        this.events.emit('negativeBalance', this);
      }
    }
  }

  receive(amount) {
    this.#balance += amount;
    this.updateDisplay();
    this.events.emit('balanceChange', this.balance);
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

  incrementJailTurns() {
    this.#jailTurns++;
  }

  useJailKey() {
    this.#hasJailKey = false;
    this.ui.hideJailKey();
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

  declareBankruptcy() {
    this.#bankrupt = true;
  }

  clearBankruptcy() {
    this.#bankrupt = false;
  }

  updateDisplay() {
    this.ui.updateDisplay(this.balance);
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

  get bankrupt() {
    return this.#bankrupt;
  }
}

export default Player;
