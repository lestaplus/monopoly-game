export default class TradeModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(players, currentPlayerIndex) {
    return new Promise((resolve) => {
      this.players = players;
      const wrapper = this.#renderForm(players, currentPlayerIndex);
      this.modalManager.open('');
      document.getElementById('modal-body').appendChild(wrapper);
      this.#bindHandlers(resolve, currentPlayerIndex);
    });
  }

  #renderForm(players, currentPlayerIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = 'trade-modal';

    const fromPlayer = players[currentPlayerIndex];
    const otherPlayers = players.filter((_, i) => i !== currentPlayerIndex);
    const toPlayer = otherPlayers[0];

    wrapper.innerHTML = `
        ${this.#renderPlayerSection(fromPlayer, 'from')}
        ${this.#renderPlayerSection(toPlayer, 'to', otherPlayers)}
      <div class="trade-actions">
        <button class="confirm-btn" id="confirm-btn">Підтвердити</button>
        <button class="cancel-btn" id="cancel-btn">Скасувати</button>
      </div>
    `;

    this.#fillTiles(
      wrapper.querySelector('#tiles-from'),
      fromPlayer.properties,
    );
    this.#fillTiles(wrapper.querySelector('#tiles-to'), toPlayer.properties);

    return wrapper;
  }

  #renderPlayerOptions(players) {
    return players
      .map((p) => `<option value="${p.index}">${p.name}</option>`)
      .join('');
  }

  #renderPlayerSection(player, prefix, selectPlayers = null) {
    const selectHTML = selectPlayers
      ? `
        <label>Оберіть гравця:</label>
        <select id="trade-target">
          ${this.#renderPlayerOptions(selectPlayers)}
        </select>
      `
      : '';

    return `
      <div class="player-side" id="${prefix}-side">
        <h3 id="${prefix}-name">Гравець: ${player.name}</h3>
        ${selectHTML}
        <label for="money-${prefix}">Гроші:</label>
        <input id="money-${prefix}" type="number" value="0" />
        <label for="tiles-${prefix}">Майно:</label>
        <select id="tiles-${prefix}" multiple></select>
      </div>
    `;
  }

  #fillTiles(selectEl, tiles) {
    selectEl.innerHTML = '';
    (tiles || []).forEach((tile) => {
      const option = document.createElement('option');
      option.value = tile.name;
      option.textContent = tile.name;
      selectEl.appendChild(option);
    });
  }

  #bindHandlers(resolve, currentPlayerIndex) {
    document.getElementById('confirm-btn').onclick = () => {
      const data = this.#collectData(currentPlayerIndex);
      this.modalManager.close();
      resolve(data);
    };

    document.getElementById('cancel-btn').onclick = () => {
      this.modalManager.close();
      resolve(null);
    };

    const tradeTarget = document.getElementById('trade-target');
    if (tradeTarget) {
      tradeTarget.addEventListener('change', (e) => {
        const targetIndex = parseInt(e.target.value);
        const targetPlayer = this.players[targetIndex];

        const tilesToSelect = document.getElementById('tiles-to');
        this.#fillTiles(tilesToSelect, targetPlayer.properties);

        const header = document.getElementById('to-name');
        if (header) header.textContent = `Гравець: ${targetPlayer.name}`;
      });
    }
  }

  #collectData(currentPlayerIndex) {
    const fromIndex = currentPlayerIndex;
    const toIndex = parseInt(document.getElementById('trade-target').value);

    const moneyFrom =
      parseInt(document.getElementById('money-from').value) || 0;
    const moneyTo = parseInt(document.getElementById('money-to').value) || 0;

    const tilesFrom = Array.from(
      document.querySelectorAll('#tiles-from option:checked'),
    ).map((option) => option.value);
    const tilesTo = Array.from(
      document.querySelectorAll('#tiles-to option:checked'),
    ).map((option) => option.value);

    return { fromIndex, toIndex, moneyFrom, moneyTo, tilesFrom, tilesTo };
  }
}
