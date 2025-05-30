export default class PropertyModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile, player) {
    this.tile = tile;
    this.player = player;

    const container = this.#createContainer();
    this.modalManager.open(container);
    this.modalManager.setModalBlocked(true);

    this.#bindHandler(container);
  }

  #getValues() {
    const baseRent = Math.floor(this.tile.price * 0.1);
    const rentLevels = this.tile.rentLevels.map((mult) =>
      Math.floor(baseRent * mult),
    );
    const mortgageValue = Math.floor(this.tile.price * 0.5);
    const redemptionValue = Math.floor(mortgageValue * 1.1);

    return {
      baseRent,
      rentLevels,
      mortgageValue,
      redemptionValue,
    };
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'property-modal';

    const { baseRent, rentLevels, mortgageValue, redemptionValue } =
      this.#getValues();

    container.innerHTML = `
      <button class="modal-close" id="close-btn">&#x2715;</button>
      <h2>${this.tile.name}</h2><hr>
      <h4>Ціна: ${this.tile.price}₴</h4>
      <h4>Базова оренда: ${baseRent}₴</h4><hr>
      <div>Рівні покращень:</div>
      <div>1 будинок: ${rentLevels[1]}₴</div>
      <div>2 будинки: ${rentLevels[2]}₴</div>
      <div>3 будинки: ${rentLevels[3]}₴</div>
      <div>4 будинки: ${rentLevels[4]}₴</div>
      <div>Готель: ${rentLevels[5]}₴</div><hr>
      <div>Ціна будинку/готеля: ${this.tile.buildingCost}₴</div>
      <div>Залог: ${mortgageValue}₴</div>
      <div>Викуп: ${redemptionValue}₴</div>
    `;

    return container;
  }

  #bindHandler(container) {
    const closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        this.modalManager.setModalBlocked(false);
      },
      { once: true },
    );
  }
}
