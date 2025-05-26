export default class JailModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(player) {
    const container = this.#createContainer(player);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(container, resolve, player);
    });
  }

  #createContainer(player) {
    const container = document.createElement('div');
    container.className = 'jail-modal';

    container.innerHTML = `
      <h2>${player.name}, ви у в'язниці!</h2>
      <p>Ви можете спробувати кинути дубль <span id="double-attempt"></span>, сплатити штраф 50₴ або використати ключ (якщо є).</p>
      <div class="jail-actions">
        <button id="double-btn">Дубль</button>
        <button id="fine-btn">Штраф</button>
        <button id="key-btn">Ключ</button>
      </div>
    `;
    const doubleAttempt = container.querySelector('#double-attempt');
    doubleAttempt.textContent = `(${player.jailTurns + 1} з 3)`;

    return container;
  }

  #bindHandlers(container, resolve, player) {
    const doubleBtn = container.querySelector('#double-btn');
    const fineBtn = container.querySelector('#fine-btn');
    const keyBtn = container.querySelector('#key-btn');

    if (!player.hasJailKey) {
      keyBtn.disabled = true;
      keyBtn.title = 'У вас немає ключа';
    }

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

    keyBtn.addEventListener(
      'click',
      () => {
        this.#handleAction('key', resolve);
      },
      { once: true },
    );
  }

  #handleAction(action, resolve) {
    this.modalManager.close();
    resolve(action);
  }
}
