export default class NoFundsModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show() {
    return new Promise((resolve) => {
      const container = this.#createContainer();
      this.modalManager.open(container);
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
    document.getElementById('auction-btn').onclick = () => {
      this.modalManager.close();
      resolve();
    };
  }
}
