import TileRenderer from './TileRenderer.js';

export default class BoardRenderer {
  constructor(modalService) {
    this.sectors = this.#createSectors();
    this.modalService = modalService;
    this.tileRenderers = new Map();
  }

  #createSectors() {
    return [
      {
        element: document.getElementById('top-row'),
        range: [0, 10],
        step: 1,
      },
      {
        element: document.getElementById('right-col'),
        range: [11, 19],
        step: 1,
      },
      {
        element: document.getElementById('bottom-row'),
        range: [30, 20],
        step: -1,
      },
      {
        element: document.getElementById('left-col'),
        range: [39, 31],
        step: -1,
      },
    ];
  }

  render(tiles) {
    for (const { element, range, step } of this.sectors) {
      for (
        let i = range[0];
        step > 0 ? i <= range[1] : i >= range[1];
        i += step
      ) {
        const tileRenderer = new TileRenderer(tiles[i], i, this.modalService);
        const tile = tileRenderer.render();
        this.tileRenderers.set(i, tileRenderer);
        element.appendChild(tile);
      }
    }
  }

  updatePlayerTokens(players) {
    document.querySelectorAll('.player-token').forEach((el) => el.remove());

    players.forEach((player, i) => {
      const tilePlayersContainer = document.querySelector(
        `.tile[data-index="${player.position}"] .tile-players`,
      );
      if (tilePlayersContainer) {
        tilePlayersContainer.insertAdjacentHTML(
          'beforeend',
          `
          <div class="player-token player-${i + 1}">${i + 1}</div>
        `,
        );
      }
    });
  }

  getTileRendererByIndex(index) {
    return this.tileRenderers.get(index);
  }
}
