export default class TileRenderer {
  constructor(data, index, modalService) {
    this.data = data;
    this.index = index;
    this.modalService = modalService;
  }

  #getSide() {
    const i = this.index;
    if (i <= 10) return 'top';
    if (i <= 19) return 'right';
    if (i <= 30) return 'bottom';
    return 'left';
  }

  render() {
    const side = this.#getSide();
    const hasColor = !!this.data.color;

    const tile = document.createElement('div');
    tile.className =
      `tile ${this.data.color || ''} ${hasColor ? 'tile-color' : ''}`.trim();
    tile.dataset.index = this.index;
    tile.dataset.type = this.data.type;
    tile.dataset.side = side;

    tile.innerHTML = `
      <div class="tile-content">
        <span>${this.data.name}</span>
        ${this.data.price ? `<div class="tile-price">${this.data.price}₴</div>` : ''}
      </div>
    `;

    this.#bindHandlers(tile);

    return tile;
  }

  #bindHandlers(tile) {
    tile.addEventListener('click', () => {
      if (this.modalService.modalManager.getModalBlocked()) return;

      if (this.data.type === 'property') {
        this.modalService.propertyModal.show(this.data);
      } else if (this.data.type === 'railroad') {
        this.modalService.railroadModal.show(this.data);
      } else if (this.data.type === 'utility') {
        this.modalService.utilityModal.show(this.data);
      }
    });
  }
}
