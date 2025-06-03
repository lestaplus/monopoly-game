export default class PurchaseModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile) {
    const container = this.#createContainer(tile);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(container, resolve);
    });
  }

  #createContainer(tile) {
    const container = document.createElement('div');
    container.className = 'purchase-modal';

    container.innerHTML = `
      <h2>Купівля</h2>
      <p>Ви можете купити ${tile.name} за ${tile.price}₴.</p>
        <div class="purchase-actions">
          <button id="buy-btn-purchase">Купити</button>
          <button id="auction-btn-purchase">Аукціон</button>
        </div>
    `;

    return container;
  }

  #bindHandlers(container, resolve) {
    const buyBtn = container.querySelector('#buy-btn-purchase');
    const auctionBtn = container.querySelector('#auction-btn-purchase');

    buyBtn.addEventListener(
      'click',
      () => {
        this.#handleAction('buy', resolve);
      },
      { once: true },
    );

    auctionBtn.addEventListener(
      'click',
      () => {
        this.#handleAction('auction', resolve);
      },
      { once: true },
    );
  }

  #handleAction(action, resolve) {
    this.modalManager.close();
    resolve(action);
  }
}
