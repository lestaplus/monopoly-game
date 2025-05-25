export default class TradeModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(players, currentPlayerIndex) {
    this.players = players;
    this.currentPlayerIndex = currentPlayerIndex;

    const container = this.#renderForm(players, currentPlayerIndex);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(container, resolve);
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

  #bindHandlers(container, resolve) {
    const confirmBtn = container.querySelector('#confirm-btn');
    const cancelBtn = container.querySelector('#cancel-btn');

    confirmBtn.addEventListener(
      'click',
      () => {
        this.#handleAction(container, 'confirm', resolve);
      },
      { once: true },
    );

    cancelBtn.addEventListener(
      'click',
      () => {
        this.#handleAction(container, 'cancel', resolve);
      },
      { once: true },
    );

    this.#bindMoneyInputs(container);
    this.#bindTileInputs(container);
    this.#bindTargetSelector(container);
    this.#updateConfirmButton(container);
  }

  #handleAction(container, action, resolve) {
    if (action === 'confirm') {
      const data = this.#collectData(container);
      this.modalManager.close();
      resolve(data);
    } else if (action === 'cancel') {
      this.modalManager.close();
      resolve(null);
    }
  }

  #bindMoneyInputs(container) {
    const fromPlayer = this.players[this.currentPlayerIndex];
    const toPlayer = this.#getInitialToPlayer();

    const moneyFrom = container.querySelector('#money-from');
    const moneyTo = container.querySelector('#money-to');

    this.#validateMoneyInput(container, moneyFrom, fromPlayer.balance);
    this.#validateMoneyInput(container, moneyTo, toPlayer.balance);
  }

  #validateMoneyInput(container, input, max) {
    const clonedInput = input.cloneNode(true);
    input.replaceWith(clonedInput);

    const handler = () => {
      let value = parseInt(clonedInput.value);
      if (isNaN(value) || value < 0) value = 0;
      if (value > max) value = max;
      clonedInput.value = String(value);
      this.#updateConfirmButton(container);
    };
    clonedInput.addEventListener('input', handler);
    handler();
  }

  #bindTileInputs(container) {
    const tilesFrom = container.querySelector('#tiles-from');
    const tilesTo = container.querySelector('#tiles-to');

    [tilesFrom, tilesTo].forEach((el) => {
      el.addEventListener('input', () => this.#updateConfirmButton(container));
      el.addEventListener('change', () => this.#updateConfirmButton(container));
    });
  }

  #bindTargetSelector(container) {
    const tradeTarget = container.querySelector('#trade-target');

    const handler = (e) => {
      const toIndex = parseInt(e.target.value);
      const toPlayer = this.players[toIndex];

      const tilesTo = container.querySelector('#tiles-to');
      const toName = container.querySelector('#to-name');
      const moneyTo = container.querySelector('#money-to');

      this.#fillTiles(tilesTo, toPlayer.properties, 'to');
      toName.textContent = `Гравець: ${toPlayer.name}`;

      this.#validateMoneyInput(container, moneyTo, toPlayer.balance);

      this.#updateConfirmButton(container);
    };

    tradeTarget.addEventListener('change', handler);
  }

  #updateConfirmButton(container) {
    const moneyFrom =
      parseInt(container.querySelector('#money-from').value) || 0;
    const moneyTo = parseInt(container.querySelector('#money-to').value) || 0;
    const tilesFrom = this.#getSelectedTileValues(
      container.querySelector('#tiles-from'),
    );
    const tilesTo = this.#getSelectedTileValues(
      container.querySelector('#tiles-to'),
    );

    const isValid =
      moneyFrom > 0 ||
      moneyTo > 0 ||
      tilesFrom.length > 0 ||
      tilesTo.length > 0;

    const confirmBtn = container.querySelector('#confirm-btn');
    confirmBtn.disabled = !isValid;
  }

  #getInitialToPlayer() {
    const otherPlayers = this.players.filter(
      (_, i) => i !== this.currentPlayerIndex,
    );
    return otherPlayers[0];
  }

  #getSelectedTileValues(container) {
    return Array.from(
      container.querySelectorAll(`input[type="checkbox"]:checked`),
    ).map((checkbox) => checkbox.value);
  }

  #collectData(container) {
    const fromIndex = this.currentPlayerIndex;
    const toIndex = parseInt(container.querySelector('#trade-target').value);

    const fromPlayer = this.players[fromIndex];
    const toPlayer = this.players[toIndex];

    let moneyFrom = parseInt(container.querySelector('#money-from').value) || 0;
    let moneyTo = parseInt(container.querySelector('#money-to').value) || 0;

    moneyFrom = Math.max(0, Math.min(moneyFrom, fromPlayer.balance));
    moneyTo = Math.max(0, Math.min(moneyTo, toPlayer.balance));

    const tilesFrom = this.#getSelectedTileValues(
      container.querySelector('#tiles-from'),
    );
    const tilesTo = this.#getSelectedTileValues(
      container.querySelector('#tiles-to'),
    );

    return {
      from: { fromIndex, moneyFrom, tilesFrom },
      to: { toIndex, moneyTo, tilesTo },
    };
  }
}
