import PlayerUI from './ui/PlayerUI.js';

class Player {
  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.balance = 1500;
    this.position = 0;
    this.properties = [];
    this.inJail = false;
    this.hasJailKey = false;
    this.skipTurn = false;
    this.doubleRollsCount = 0;

    this.ui = new PlayerUI(name, index);
    this.element = this.ui.element;
    this.ui.updateDisplay(this.balance);
  }

  move(steps, boardLength) {
    this.position = (this.position + steps) % boardLength;
  }

  setBalance(amount) {
    this.balance += amount;
    this.ui.updateDisplay(this.balance);
  }

  addProperty(property) {
    this.properties.push(property);
  }

  updateDisplay() {
    this.ui.updateDisplay(this.balance);
  }

  setActive(isActive) {
    this.ui.setActive(isActive);
  }

  setPosition(index) {
    this.position = index;
  }

  goToJail() {
    this.position = 10;
    this.inJail = true;
  }

  tryExitJail() {
    if (this.hasJailKey) {
      alert(`${this.name} використав ключ для виходу з в'язниці.`);
      this.hasJailKey = false;
      this.inJail = false;
      this.jailTurns = 0;
      return true;
    }

    const choice = prompt(
      `${this.name}, ви у в'язниці. Спробувати дубль (1) чи сплатити штраф 50₴ (2)`,
      '1',
    );

    if (choice === '2') {
      alert(`${this.name} сплатив штраф 50₴ і виходить з в'язниці`);
      this.setBalance(-50);
      this.inJail = false;
      this.jailTurns = 0;
      return true;
    }

    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;
    alert(
      `${this.name} кидає кубики для виходу з в'язниці: ${firstDice} + ${secondDice}`,
    );

    if (firstDice === secondDice) {
      alert(`${this.name} вибив дубль і виходить з в'язниці`);
      this.inJail = false;
      this.jailTurns = 0;
      return true;
    } else {
      this.jailTurns = (this.jailTurns || 0) + 1;
      alert(`${this.name} не вибив дубль. Спроба ${this.jailTurns}/3`);

      if (this.jailTurns >= 3) {
        alert(`${this.name} не вибив дубль за 3 спроби. Сплачує 50₴`);
        this.setBalance(-50);
        this.inJail = false;
        this.jailTurns = 0;
        return true;
      }

      return false;
    }
  }

  shouldSkipTurn() {
    if (this.skipTurn) {
      this.skipTurn = false;
      alert(`${this.name} пропускає хід`);
      return true;
    }
    return false;
  }

  incrementDoubleRolls() {
    this.doubleRollsCount++;
  }

  resetDoubleRolls() {
    this.doubleRollsCount = 0;
  }

  getDoubleRollsCount() {
    return this.doubleRollsCount;
  }
}

export default Player;
