export default class PurchaseModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile) {
    return new Promise((resolve) => {
      const container = this.#createContainer(tile);
      this.modalManager.open(container);
      this.#bindHandlers(resolve);
    });
  }

  #createContainer(tile) {
    return `
      <div class="purchase-modal">
        <h2>Ви можете купити ${tile.name} за ${tile.price}₴.</h2>
        <div class="purchase-actions">
          <button class="buy-btn" id="buy-btn">Купити</button>
          <button class="auction-btn" id="auction-btn">Аукціон</button>
        </div>
      </div>
    `;
  }

  #bindHandlers(resolve) {
    document.getElementById('buy-btn').onclick = () => {
      this.modalManager.close();
      resolve('buy');
    };

    document.getElementById('auction-btn').onclick = () => {
      this.modalManager.close();
      resolve('auction');
    };
  }
}
