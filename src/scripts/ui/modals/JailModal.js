export default class JailModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(player) {
    const container = this.#createContainer(player);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(container, resolve);
    });
  }

  #createContainer(player) {
    const container = document.createElement('div');
    container.className = 'jail-modal';

    container.innerHTML = `
      <h2>${player.name}, ви у в'язниці!</h2>
      <p>Ви можете спробувати кинути дубль <span id="double-attempt"></span>, щоб вийти, або сплатити штраф у 50₴.</p>
      <div class="jail-actions">
        <button id="double-btn">Спробувати дубль </button>
        <button id="fine-btn">Сплатити штраф</button>
      </div>
    `;
    const doubleAttempt = container.querySelector('#double-attempt');
    doubleAttempt.textContent = `(${player.jailTurns + 1} з 3)`;

    return container;
  }

  #bindHandlers(container, resolve) {
    const doubleBtn = container.querySelector('#double-btn');
    const fineBtn = container.querySelector('#fine-btn');

    doubleBtn.addEventListener(
      'click',
      () => {
        this.#handleAction('roll', resolve);
      },
      { once: true },
    );

    fineBtn.addEventListener(
      'click',
      () => {
        this.#handleAction('pay', resolve);
      },
      { once: true },
    );
  }

  #handleAction(action, resolve) {
    this.modalManager.close();
    resolve(action);
  }
}
