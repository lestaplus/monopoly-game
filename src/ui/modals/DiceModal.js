import { timeoutIterator } from '../../utils/timeoutIterator.js';

export default class DiceModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(title = 'Кидаємо кубики...') {
    const container = this.#createContainer(title);
    this.modalManager.open(container);
    this.modalManager.setModalBlocked(true);
    this.modalManager.setPlayerMenuDisabled(true);

    return new Promise((resolve) => {
      const diceImg1 = container.querySelector('#diceImg1');
      const diceImg2 = container.querySelector('#diceImg2');

      this.#rollDice(container, diceImg1, diceImg2, resolve);
    });
  }

  #createContainer(title) {
    const container = document.createElement('div');
    container.className = 'dice-modal';

    container.innerHTML = `
      <h2 id="dice-title">${title}</h2>
      <div class="dice-display">
        <img id="diceImg1" class="dice-svg" width="60" height="60" alt="Dice 1" />
        <img id="diceImg2" class="dice-svg" width="60" height="60" alt="Dice 2" />
      </div>
    `;

    return container;
  }

  #dicePairGenerator() {
    return function* () {
      while (true) {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        yield [dice1, dice2];
      }
    };
  }

  #updateDiceImage(img, value) {
    img.setAttribute('src', `/assets/images/dice/dice-${value}.svg`);
  }

  #rollDice(container, diceImg1, diceImg2, resolve) {
    const title = container.querySelector('#dice-title');

    const pairGen = this.#dicePairGenerator()();

    let finalDice1 = 1;
    let finalDice2 = 1;

    const callback = ([value1, value2]) => {
      finalDice1 = value1;
      finalDice2 = value2;

      this.#updateDiceImage(diceImg1, value1);
      this.#updateDiceImage(diceImg2, value2);
    };

    timeoutIterator(pairGen, 0.15, callback, 100);

    setTimeout(() => {
      title.textContent = 'Кубики випали!';

      this.#updateDiceImage(diceImg1, finalDice1);
      this.#updateDiceImage(diceImg2, finalDice2);

      setTimeout(() => {
        this.modalManager.close();
        this.modalManager.setModalBlocked(false);
        this.modalManager.setPlayerMenuDisabled(false);
        resolve({ dice1: finalDice1, dice2: finalDice2 });
      }, 150);
    }, 150);
  }
}
