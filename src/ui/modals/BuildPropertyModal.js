export default class BuildPropertyModal {
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

  #getBuildableProperties() {
    return this.board.tiles.filter((tile) => {
      return (
        tile.type === 'property' &&
        tile.owner === this.player &&
        tile.hasSameColorTiles(this.player)
      );
    });
  }

  #getBuildingStatus(property) {
    if (property.hotel) {
      return 'готель';
    }
    return `${property.houses} буд.`;
  }

  #getPropertyByIndex(index) {
    return this.board.tiles.find(
      (tile) => tile.type === 'property' && tile.index === index,
    );
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'build-property-modal';

    container.innerHTML = `
      <h2>Будівництво</h2>
      <div class="property-list">
        ${this.#renderProperties()}
      </div>
      <div class="build-property-actions">
        <button class="modal-close" id="close-btn-build">&#x2715;</button>
      </div>
    `;

    return container;
  }

  #renderProperties() {
    const properties = this.#getBuildableProperties();

    if (properties.length === 0) {
      return '<p>Немає доступної власності для покращення.</p>';
    }

    return properties
      .map((property) => {
        const buildDisabled = !(
          property.canBuyHouse(this.player) || property.canBuyHotel(this.player)
        );
        const sellDisabled = !(
          property.canSellHouse(this.player) ||
          property.canSellHotel(this.player)
        );

        const buildBtnLabel = property.hotel
          ? 'Побудовано'
          : property.houses < 4
            ? 'Купити будинок'
            : 'Купити готель';
        const sellBtnLabel = property.hotel
          ? 'Продати готель'
          : property.houses > 0
            ? 'Продати будинок'
            : 'Нічого продавати';

        return `
      <div class="property-item">
        <span data-property-index="${property.index}">${property.name} (${this.#getBuildingStatus(property)})</span>
        <div class="property-buttons">
          <button class="build-btn" data-build-property="${property.index}" ${buildDisabled ? 'disabled' : ''}>
            ${buildBtnLabel}
          </button>
          <button class="sell-btn" data-sell-property="${property.index}" ${sellDisabled ? 'disabled' : ''}>
            ${sellBtnLabel}
          </button>
        </div>
      </div>
    `;
      })
      .join('');
  }

  #updatePropertyList(container) {
    this.#updateBuildButtons(container);
    this.#updateSellButtons(container);
    this.#updatePropertyNames(container);
  }

  #updateBuildButtons(container) {
    const buildButtons = container.querySelectorAll('.build-btn');

    buildButtons.forEach((button) => {
      const propertyIndex = Number(button.getAttribute('data-build-property'));
      const property = this.#getPropertyByIndex(propertyIndex);
      if (!property) return;

      const buildDisabled = !(
        property.canBuyHouse(this.player) || property.canBuyHotel(this.player)
      );
      const buildBtnLabel = property.hotel
        ? 'Побудовано'
        : property.houses < 4
          ? 'Купити будинок'
          : 'Купити готель';

      button.disabled = buildDisabled;
      button.innerText = buildBtnLabel;
    });
  }

  #updateSellButtons(container) {
    const sellButtons = container.querySelectorAll('.sell-btn');

    sellButtons.forEach((button) => {
      const propertyIndex = Number(button.getAttribute('data-sell-property'));
      const property = this.#getPropertyByIndex(propertyIndex);
      if (!property) return;

      const sellDisabled = !(
        property.canSellHouse(this.player) || property.canSellHotel(this.player)
      );
      const sellBtnLabel = property.hotel
        ? 'Продати готель'
        : property.houses > 0
          ? 'Продати будинок'
          : 'Нічого продавати';

      button.disabled = sellDisabled;
      button.innerText = sellBtnLabel;
    });
  }

  #updatePropertyNames(container) {
    const names = container.querySelectorAll('span[data-property-index]');

    names.forEach((name) => {
      const propertyIndex = Number(name.getAttribute('data-property-index'));
      const property = this.#getPropertyByIndex(propertyIndex);
      if (!property) return;

      name.innerText = `${property.name} (${this.#getBuildingStatus(property)})`;
    });
  }

  #syncAndRender(property) {
    const tileRenderer = this.board.renderer.getTileRendererByIndex(
      property.index,
    );
    tileRenderer.updateBuildings();
  }

  #bindHandlers(container) {
    const buildButtons = container.querySelectorAll('.build-btn');
    const sellButtons = container.querySelectorAll('.sell-btn');
    const closeBtn = container.querySelector('#close-btn-build');

    buildButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const propertyIndex = Number(
          button.getAttribute('data-build-property'),
        );
        const property = this.#getPropertyByIndex(propertyIndex);

        if (
          property &&
          (property.buyHotel(this.player) || property.buyHouse(this.player))
        ) {
          this.#syncAndRender(property);
          this.#updatePropertyList(container);
        }
      });
    });

    sellButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const propertyIndex = Number(button.getAttribute('data-sell-property'));
        const property = this.#getPropertyByIndex(propertyIndex);

        if (
          property &&
          (property.sellHotel(this.player) || property.sellHouse(this.player))
        ) {
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
