export default class RailroadModal {
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
    container.className = 'railroad-modal';

    container.innerHTML = `
      <button class="modal-close" id="close-btn">&#x2715;</button>
      <h2>${this.tile.name}</h2><hr>
      <h4>Ціна: ${this.tile.price}</h4><hr>
      <div>Оренда залежить від кількості залізниць у власності:</div>
      <div>1 залізниця: ${this.tile.rentMap['1']}₴</div>
      <div>2 залізниці: ${this.tile.rentMap['2']}₴</div>
      <div>3 залізниці: ${this.tile.rentMap['3']}₴</div>
      <div>4 залізниці: ${this.tile.rentMap['4']}₴</div>
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
