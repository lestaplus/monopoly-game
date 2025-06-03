export default class UtilityModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile) {
    this.tile = tile;

    const container = this.#createContainer();
    this.modalManager.open(container);
    this.modalManager.setModalBlocked(true);

    this.#bindHandler(container);
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'utility-modal';

    container.innerHTML = `
      <button class="modal-close" id="close-btn-utility">&#x2715;</button>
      <h2>${this.tile.name}</h2><hr>
      <h4>Ціна: ${this.tile.price}₴</h4><hr>
      <div>Оренда залежить від кількості служб у власності:</div>
      <div>1 підприємство: 4x кидок кубиків</div>
      <div>2 підприємства: 10x кидок кубиків</div>
    `;

    return container;
  }

  #bindHandler(container) {
    const closeBtn = container.querySelector('#close-btn-utility');
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
