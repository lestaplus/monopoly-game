export default class TileRenderer {
  constructor(data, index) {
    this.name = data.name;
    this.price = data.price;
    this.amount = data.amount;
    this.color = data.color;
    this.type = data.type;
    this.index = index;
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
    const hasColor = !!this.color;

    const tile = document.createElement('div');
    tile.className =
      `tile ${this.color || ''} ${hasColor ? 'tile-color' : ''}`.trim();
    tile.dataset.index = this.index;
    tile.dataset.type = this.type;
    tile.dataset.side = side;

    tile.innerHTML = `
      <div class="tile-content">
        <span>${this.name}</span>
        ${this.price ? `<div class="tile-price">${this.price}₴</div>` : ''}
      </div>
    `;

    return tile;
  }
}
