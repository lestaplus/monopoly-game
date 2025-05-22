export default class NoFundsModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show() {
    const container = this.#createContainer();
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandler(resolve);
    });
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'funds-modal';

    container.innerHTML = `
      <h2>Недостатньо грошей</h2>
      <p>Починаємо аукціон.</p>
      <button id="auction-btn">Аукціон</button>
    `;

    return container;
  }

  #bindHandler(resolve) {
    document.getElementById('auction-btn')?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve();
      },
      { once: true },
    );
  }
}
