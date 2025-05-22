export default class TradeModal {
  #moneyInputHandlers = {};
  #targetChangeHandler = null;

  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(players, currentPlayerIndex) {
    this.players = players;
    const container = this.#renderForm(players, currentPlayerIndex);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(resolve, currentPlayerIndex);
    });
  }

  #renderForm(players, currentPlayerIndex) {
    const container = document.createElement('div');
    container.className = 'trade-modal';

    const fromPlayer = players[currentPlayerIndex];
    const otherPlayers = players.filter((_, i) => i !== currentPlayerIndex);
    const toPlayer = otherPlayers[0];

    container.innerHTML = `
        ${this.#renderPlayerSection(fromPlayer, 'from')}
        ${this.#renderPlayerSection(toPlayer, 'to', otherPlayers)}
      <div class="trade-actions">
        <button class="confirm-btn" id="confirm-btn">Підтвердити</button>
        <button class="cancel-btn" id="cancel-btn">Скасувати</button>
      </div>
    `;

    this.#fillTiles(
      container.querySelector('#tiles-from'),
      fromPlayer.properties,
    );
    this.#fillTiles(container.querySelector('#tiles-to'), toPlayer.properties);

    return container;
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
        <input id="money-${prefix}" type="number" value="0"/>
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
    const fromPlayer = this.players[currentPlayerIndex];
    const toPlayer = this.#getInitialToPlayer(currentPlayerIndex);

    this.#bindActionButtons(resolve, currentPlayerIndex);
    this.#bindMoneyLimits(fromPlayer, toPlayer);
    this.#bindTargetChangeHandler(fromPlayer);
  }

  #bindMoneyLimits(fromPlayer, toPlayer) {
    const fromInput = document.getElementById('money-from');
    const toInput = document.getElementById('money-to');

    const bind = (input, max, key) => {
      if (this.#moneyInputHandlers[key]) {
        input.removeEventListener('input', this.#moneyInputHandlers[key]);
      }

      input.min = 0;
      input.max = max;

      const check = () => {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0) value = 0;
        if (value > max) value = max;
        input.value = value;
      };

      input.addEventListener('input', check);
      this.#moneyInputHandlers[key] = check;
      check();
    };

    if (fromInput) bind(fromInput, fromPlayer.balance, 'from');
    if (toInput) bind(toInput, toPlayer.balance, 'to');
  }

  #bindActionButtons(resolve, currentPlayerIndex) {
    document.getElementById('confirm-btn')?.addEventListener(
      'click',
      () => {
        const data = this.#collectData(currentPlayerIndex);
        this.modalManager.close();
        resolve(data);
      },
      { once: true },
    );

    document.getElementById('cancel-btn')?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve(null);
      },
      { once: true },
    );
  }

  #getInitialToPlayer(currentPlayerIndex) {
    const tradeTarget = document.getElementById('trade-target');
    const toIndex = tradeTarget
      ? parseInt(tradeTarget.value)
      : this.players.findIndex((_, i) => i !== currentPlayerIndex);

    return this.players[toIndex];
  }

  #bindTargetChangeHandler(fromPlayer) {
    const tradeTarget = document.getElementById('trade-target');
    if (!tradeTarget) return;

    if (this.#targetChangeHandler) {
      tradeTarget.removeEventListener('change', this.#targetChangeHandler);
    }

    const handler = (e) => {
      const toIndex = parseInt(e.target.value);
      const toPlayer = this.players[toIndex];

      const tilesToSelect = document.getElementById('tiles-to');
      this.#fillTiles(tilesToSelect, toPlayer.properties);

      const header = document.getElementById('to-name');
      if (header) header.textContent = `Гравець: ${toPlayer.name}`;

      this.#bindMoneyLimits(fromPlayer, toPlayer);
    };

    tradeTarget.addEventListener('change', handler);
    this.#targetChangeHandler = handler;
  }

  #getSelectedTileValues(selectorId) {
    return Array.from(
      document.querySelectorAll(`#${selectorId} option:checked`),
    ).map((option) => option.value);
  }

  #collectData(currentPlayerIndex) {
    const fromIndex = currentPlayerIndex;
    const toIndex = parseInt(document.getElementById('trade-target').value);

    const fromPlayer = this.players[fromIndex];
    const toPlayer = this.players[toIndex];

    let moneyFrom = parseInt(document.getElementById('money-from').value) || 0;
    let moneyTo = parseInt(document.getElementById('money-to').value) || 0;

    moneyFrom = Math.max(0, Math.min(moneyFrom, fromPlayer.balance));
    moneyTo = Math.max(0, Math.min(moneyTo, toPlayer.balance));

    const tilesFrom = this.#getSelectedTileValues('tiles-from');
    const tilesTo = this.#getSelectedTileValues('tiles-to');

    return { fromIndex, toIndex, moneyFrom, moneyTo, tilesFrom, tilesTo };
  }
}
