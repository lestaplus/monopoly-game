export default class MortgageModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(board, player) {
    this.board = board;
    this.player = player;

    const container = this.#createContainer();
    this.modalManager.open(container);
    this.modalManager.setModalBlocked(true);
    this.modalManager.setPlayerMenuDisabled(true);

    this.#bindHandlers(container);
    this.#updatePropertyList(container);
  }

  #getProperties() {
    return this.player.properties;
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'mortgage-modal';

    container.innerHTML = `
      <h2>Застава та викуп</h2>
      <div class="property-list">
        ${this.#renderProperties()}
      </div>
      <div id="mortgage-actions">
        <button class="modal-close" id="close-btn-mortgage">&#x2715;</button>
      </div>
    `;

    return container;
  }

  #renderProperties() {
    const properties = this.#getProperties();

    if (properties.length === 0) {
      return `<p>Немає доступної власності.</p>`;
    }

    return properties
      .map((property) => {
        return `
        <div class="property-item">
          <span>${property.name}</span>
          <div class="property-buttons">
            <button class="mortgage-btn" data-mortgage-property="${property.index}">Закласти</button>
            <button class="redeem-btn" data-redeem-property="${property.index}">Викупити</button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  #getPropertyByIndex(index) {
    return this.board.tiles.find((tile) => tile.index === index);
  }

  #updatePropertyList(container) {
    this.#updateMortgageButtons(container);
    this.#updateRedeemButtons(container);
  }

  #updateMortgageButtons(container) {
    const mortgageButtons = container.querySelectorAll('.mortgage-btn');

    mortgageButtons.forEach((button) => {
      const propertyIndex = Number(
        button.getAttribute('data-mortgage-property'),
      );
      const property = this.#getPropertyByIndex(propertyIndex);
      if (!property) return;

      button.disabled = !property.canMortgage(this.player);
    });
  }

  #updateRedeemButtons(container) {
    const mortgageButtons = container.querySelectorAll('.redeem-btn');

    mortgageButtons.forEach((button) => {
      const propertyIndex = Number(button.getAttribute('data-redeem-property'));
      const property = this.#getPropertyByIndex(propertyIndex);
      if (!property) return;

      button.disabled = !property.canRedeem(this.player);
    });
  }

  #syncAndRender(property) {
    const tileRenderer = this.board.renderer.getTileRendererByIndex(
      property.index,
    );
    if (tileRenderer) {
      tileRenderer.updateMortgageStatus();
    }
  }

  #bindHandlers(container) {
    const mortgageButtons = container.querySelectorAll('.mortgage-btn');
    const redeemButtons = container.querySelectorAll('.redeem-btn');
    const closeBtn = container.querySelector('#close-btn-mortgage');

    mortgageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const propertyIndex = Number(
          button.getAttribute('data-mortgage-property'),
        );
        const property = this.#getPropertyByIndex(propertyIndex);

        if (property && property.canMortgage(this.player)) {
          property.mortgage(this.player);

          this.#syncAndRender(property);
          this.#updatePropertyList(container);
        }
      });
    });

    redeemButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const propertyIndex = Number(
          button.getAttribute('data-redeem-property'),
        );
        const property = this.#getPropertyByIndex(propertyIndex);

        if (property && property.canRedeem(this.player)) {
          property.redeem(this.player);

          this.#syncAndRender(property);
          this.#updatePropertyList(container);
        }
      });
    });

    closeBtn.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        this.modalManager.setModalBlocked(false);
        this.modalManager.setPlayerMenuDisabled(false);
      },
      { once: true },
    );
  }
}
