export default class PurchaseModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile) {
    const container = this.#createContainer(tile);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(resolve);
    });
  }

  #createContainer(tile) {
    const container = document.createElement('div');
    container.className = 'purchase-modal';

    container.innerHTML = `
      <h2>Ви можете купити ${tile.name} за ${tile.price}₴.</h2>
        <div class="purchase-actions">
          <button class="buy-btn" id="buy-btn">Купити</button>
          <button class="auction-btn" id="auction-btn">Аукціон</button>
        </div>
    `;

    return container;
  }

  #bindHandlers(resolve) {
    document.getElementById('buy-btn')?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve('buy');
      },
      { once: true },
    );

    document.getElementById('auction-btn')?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve('auction');
      },
      { once: true },
    );
  }
}
