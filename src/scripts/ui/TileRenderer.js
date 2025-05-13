class TileRenderer {
  constructor(data, index) {
    this.name = data.name;
    this.price = data.price;
    this.amount = data.amount;
    this.color = data.color;
    this.type = data.type;
    this.index = index;
  }

  render() {
    const tile = document.createElement('div');
    tile.className = 'tile';

    if (this.color) {
      tile.classList.add(this.color);
    }

    const content = document.createElement('div');
    content.className = 'tile-content';
    content.innerText = this.name;

    if (this.price) {
      const priceDiv = document.createElement('div');
      priceDiv.className = 'tile-price';
      priceDiv.innerText = `${this.price}₴`;
      content.appendChild(priceDiv);
    }

    const sideClasses = {
      top: {
        range: [0, 10],
        tileLine: 'line-top',
        textClass: '',
      },
      right: {
        range: [11, 19],
        tileLine: 'line-right',
        textClass: 'text-right',
      },
      bottom: {
        range: [20, 30],
        tileLine: 'line-bottom',
        textClass: '',
      },
      left: {
        range: [31, 39],
        tileLine: 'line-left',
        textClass: 'text-left',
      },
    };

    for (const side in sideClasses) {
      const { range, tileLine, textClass } = sideClasses[side];
      if (this.index >= range[0] && this.index <= range[1]) {
        tile.classList.add(tileLine);
        if (textClass) {
          content.classList.add(textClass);
        }
      }
    }

    tile.appendChild(content);
    tile.dataset.type = this.type;
    tile.dataset.index = this.index;

    return tile;
  }
}

export default TileRenderer;
