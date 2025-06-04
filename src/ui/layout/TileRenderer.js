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
      <div class="tile-buildings"></div>
      <div class="tile-content">
        <span>${this.data.name}</span>
        ${this.data.price ? `<div class="tile-price">${this.data.price}₴</div>` : ''}
      </div>
      <div class="tile-players"></div>
    `;

    this.#bindHandlers(tile);

    return tile;
  }

  updateBuildings() {
    const container = document.querySelector(
      `.tile[data-index="${this.index}"] .tile-buildings`,
    );
    if (!container) return;

    let html = '';
    if (this.data.hotel) {
      html = `
        <img src="/assets/icons/buildings/hotel.svg" alt="Hotel" width="20" height="20" />
      `;
    } else {
      for (let i = 0; i < this.data.houses; i++) {
        html += `
          <img src="/assets/icons/buildings/house.svg" alt="House" width="20" height="20" />
        `;
      }
    }

    container.innerHTML = html;
  }

  updateMortgageStatus() {
    const tile = document.querySelector(`.tile[data-index="${this.index}"]`);
    if (!tile) return;

    if (this.data.mortgaged) {
      tile.classList.add('mortgaged');
    } else {
      tile.classList.remove('mortgaged');
    }
  }

  updateOwnership(player) {
    const tile = document.querySelector(`.tile[data-index="${this.index}"]`);
    if (!tile) return;

    tile.classList.forEach((tileClass) => {
      if (tileClass.startsWith('owned-by-')) {
        tile.classList.remove(tileClass);
      }
    });

    if (player) {
      tile.classList.add(`owned-by-${player.index + 1}`);
    }
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
