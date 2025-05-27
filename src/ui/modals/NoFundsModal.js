export default class NoFundsModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show() {
    const container = this.#createContainer();
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandler(container, resolve);
    });
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'funds-modal';

    container.innerHTML = `
      <h2>Недостатньо грошей</h2>
      <p>Починаємо аукціон.</p>
      <div class="funds-actions">
        <button id="auction-btn">Аукціон</button>
      </div>
    `;

    return container;
  }

  #bindHandler(container, resolve) {
    const auctionBtn = container.querySelector('#auction-btn');
    auctionBtn.addEventListener(
      'click',
      () => {
        this.#handleAuction(resolve);
      },
      { once: true },
    );
  }

  #handleAuction(resolve) {
    this.modalManager.close();
    resolve();
  }
}
