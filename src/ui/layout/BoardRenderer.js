import TileRenderer from './TileRenderer.js';

class BoardRenderer {
  renderTiles(tiles) {
    const sectors = [
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

    sectors.forEach(({ element, range, step }) => {
      for (
        let i = range[0];
        step > 0 ? i <= range[1] : i >= range[1];
        i += step
      ) {
        const renderer = new TileRenderer(tiles[i], i);
        element.appendChild(renderer.render());
      }
    });
  }

  updatePlayerPositions(players) {
    players.forEach((player, index) => {
      document
        .querySelectorAll(`.player-token.player-${index + 1}`)
        .forEach((element) => element.remove());

      const tileElement = document.querySelector(
        `.tile[data-index="${player.position}"]`,
      );
      if (tileElement) {
        const token = document.createElement('div');
        token.className = `player-token player-${index + 1}`;
        token.innerText = index + 1;
        tileElement.appendChild(token);
      }
    });
  }
}

export default BoardRenderer;
