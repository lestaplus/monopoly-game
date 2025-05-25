export default class TurnModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(player) {
    const container = this.#createContainer(player);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandler(container, resolve);
    });
  }

  #createContainer(player) {
    const container = document.createElement('div');
    container.className = 'turn-modal';

    container.innerHTML = `
      <h2>Хід гравця</h2>
      <p class="turn-name">${player.name}</p>
      <div class="turn-actions">
        <button id="dice-btn">Кинути кубики</button>
      </div>
    `;

    return container;
  }

  #bindHandler(container, resolve) {
    const diceBtn = container.querySelector('#dice-btn');
    diceBtn.addEventListener(
      'click',
      () => {
        this.#handleRoll(resolve);
      },
      { once: true },
    );
  }

  #handleRoll(resolve) {
    this.modalManager.close();
    resolve();
  }
}
