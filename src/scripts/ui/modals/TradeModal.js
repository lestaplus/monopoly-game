export default class TradeModal {
  #moneyInputHandlers = {};
  #targetChangeHandler = null;
  #validationHandlers = [];

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
      'from',
    );
    this.#fillTiles(
      container.querySelector('#tiles-to'),
      toPlayer.properties,
      'to',
    );

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
        <label for="trade-target">Оберіть гравця:</label>
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
        <p>Майно:</p>
        <div id="tiles-${prefix}" class="tile-checkboxes"></div>
      </div>
    `;
  }

  #bindElements() {
    this.moneyFrom = document.getElementById('money-from');
    this.moneyTo = document.getElementById('money-to');
    this.tilesFrom = document.getElementById('tiles-from');
    this.tilesTo = document.getElementById('tiles-to');
    this.confirmBtn = document.getElementById('confirm-btn');
    this.cancelBtn = document.getElementById('cancel-btn');
    this.tradeTarget = document.getElementById('trade-target');
  }

  #fillTiles(container, tiles, prefix) {
    container.innerHTML = '';
    (tiles || []).forEach((tile, index) => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="checkbox" id="tile-${prefix}-${index}" value="${tile.name}"> ${tile.name}
        `;
      container.appendChild(label);
    });
  }

  #bindHandlers(resolve, currentPlayerIndex) {
    const fromPlayer = this.players[currentPlayerIndex];
    const toPlayer = this.#getInitialToPlayer(currentPlayerIndex);

    this.#bindElements();
    this.#bindActionButtons(resolve, currentPlayerIndex);
    this.#bindMoneyLimits(fromPlayer, toPlayer);
    this.#bindTargetChangeHandler(fromPlayer);
    this.#bindValidationInputs();
    this.#updateConfirmButton();
  }

  #bindMoneyLimits(fromPlayer, toPlayer) {
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
        input.value = String(value);
      };

      input.addEventListener('input', check);
      this.#moneyInputHandlers[key] = check;
      check();
    };

    if (this.moneyFrom) bind(this.moneyFrom, fromPlayer.balance, 'from');
    if (this.moneyTo) bind(this.moneyTo, toPlayer.balance, 'to');
  }

  #bindActionButtons(resolve, currentPlayerIndex) {
    this.confirmBtn?.addEventListener(
      'click',
      () => {
        const data = this.#collectData(currentPlayerIndex);
        this.modalManager.close();
        resolve(data);
      },
      { once: true },
    );

    this.cancelBtn?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve(null);
      },
      { once: true },
    );
  }

  #getInitialToPlayer(currentPlayerIndex) {
    const toIndex = this.tradeTarget
      ? parseInt(this.tradeTarget.value)
      : this.players.findIndex((_, i) => i !== currentPlayerIndex);

    return this.players[toIndex];
  }

  #bindTargetChangeHandler(fromPlayer) {
    if (!this.tradeTarget) return;

    if (this.#targetChangeHandler) {
      this.tradeTarget.removeEventListener('change', this.#targetChangeHandler);
    }

    const handler = (e) => {
      const toIndex = parseInt(e.target.value);
      const toPlayer = this.players[toIndex];

      const tilesToSelect = this.tilesTo;
      this.#fillTiles(tilesToSelect, toPlayer.properties, 'to');

      const header = document.getElementById('to-name');
      if (header) header.textContent = `Гравець: ${toPlayer.name}`;

      this.#bindMoneyLimits(fromPlayer, toPlayer);
      this.#updateConfirmButton();
    };

    this.tradeTarget.addEventListener('change', handler);
    this.#targetChangeHandler = handler;
  }

  #getSelectedTileValues(container) {
    return Array.from(
      container.querySelectorAll(`input[type="checkbox"]:checked`),
    ).map((checkbox) => checkbox.value);
  }

  #collectData(currentPlayerIndex) {
    const fromIndex = currentPlayerIndex;
    const toIndex = parseInt(this.tradeTarget.value);

    const fromPlayer = this.players[fromIndex];
    const toPlayer = this.players[toIndex];

    let moneyFrom = parseInt(this.moneyFrom.value) || 0;
    let moneyTo = parseInt(this.moneyTo.value) || 0;

    moneyFrom = Math.max(0, Math.min(moneyFrom, fromPlayer.balance));
    moneyTo = Math.max(0, Math.min(moneyTo, toPlayer.balance));

    const tilesFrom = this.#getSelectedTileValues(this.tilesFrom);
    const tilesTo = this.#getSelectedTileValues(this.tilesTo);

    return {
      from: { fromIndex, moneyFrom, tilesFrom },
      to: { toIndex, moneyTo, tilesTo },
    };
  }

  #bindValidationInputs() {
    this.#validationHandlers.forEach(({ el, fn }) => {
      el.removeEventListener('input', fn);
      el.removeEventListener('change', fn);
    });
    this.#validationHandlers = [];

    const elements = [
      this.moneyFrom,
      this.moneyTo,
      this.tilesFrom,
      this.tilesTo,
    ];
    elements.forEach((el) => {
      const fn = () => this.#updateConfirmButton();
      el?.addEventListener('input', fn);
      el?.addEventListener('change', fn);
      this.#validationHandlers.push({ el, fn });
    });
  }

  #updateConfirmButton() {
    const moneyFrom = parseInt(this.moneyFrom.value) || 0;
    const moneyTo = parseInt(this.moneyTo.value) || 0;
    const tilesFrom = this.#getSelectedTileValues(this.tilesFrom);
    const tilesTo = this.#getSelectedTileValues(this.tilesTo);

    const isValid =
      moneyFrom > 0 ||
      moneyTo > 0 ||
      tilesFrom.length > 0 ||
      tilesTo.length > 0;

    this.confirmBtn.disabled = !isValid;
  }
}
