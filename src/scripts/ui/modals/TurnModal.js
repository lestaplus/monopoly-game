export default class TurnModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(playerName) {
    const container = this.#createContainer(playerName);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandler(resolve);
    });
  }

  #createContainer(playerName) {
    const container = document.createElement('div');
    container.className = 'turn-modal';
    container.innerHTML = `
      <h2>Хід гравця</h2>
      <p class="turn-name">${playerName}</p>
      <button id="dice-btn">Кинути кубики</button>
    `;
    return container;
  }

  #bindHandler(resolve) {
    document.getElementById('dice-btn')?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve();
      },
      { once: true },
    );
  }
}
