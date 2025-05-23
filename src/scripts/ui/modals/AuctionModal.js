export default class AuctionModal {
  #moneyInputHandler = null;

  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile, players) {
    this.tile = tile;
    this.players = players;
    this.active = [...players];
    this.bids = new Map();
    this.passed = new Set();
    this.currentPlayerIndex = 0;
    this.highestBid = tile.price;
    this.highestBidder = null;

    this.container = this.#createContainer();
    this.#bindElements();
    this.modalManager.open(this.container);
    this.#updateInfo();

    return new Promise((resolve) => {
      this.#bindHandlers(resolve);
    });
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'auction-modal';

    container.innerHTML = `
      <h2>Аукціон: ${this.tile.name}</h2>
      <div id="current-info"></div>
      <input type="number" id="bid-input" placeholder="Ваша ставка">
      <div id="bid-error"></div>
      <div class="auction-actions">
        <button class="bid-btn" id="bid-btn">Ставка</button>
        <button class="pass-btn" id="pass-btn">Пропустити</button>
      </div>
    `;

    return container;
  }

  #bindElements() {
    this.info = this.container.querySelector('#current-info');
    this.input = this.container.querySelector('#bid-input');
    this.errorBox = this.container.querySelector('#bid-error');
  }

  #bindHandlers(resolve) {
    if (this.clickHandler) {
      document
        .getElementById('modal-body')
        ?.removeEventListener('click', this.clickHandler);
    }

    this.clickHandler = (e) => {
      if (e.target.id === 'bid-btn') {
        this.#handleBid(resolve);
      }

      if (e.target.id === 'pass-btn') {
        this.#handlePass(resolve);
      }
    };

    document
      .getElementById('modal-body')
      .addEventListener('click', this.clickHandler);
  }

  #bindMoneyLimits(player) {
    if (!this.input) return;

    const max = player.balance;

    if (this.#moneyInputHandler) {
      this.input.removeEventListener('input', this.#moneyInputHandler);
    }

    this.input.min = '0';
    this.input.max = String(max);

    const check = () => {
      this.errorBox.textContent = '';
      let value = parseInt(this.input.value);
      if (isNaN(value) || value < 0) value = 0;
      if (value > max) value = max;
      this.input.value = String(value);
    };

    this.input.addEventListener('input', check);
    this.#moneyInputHandler = check;
    check();
  }

  #handleBid(resolve) {
    const value = parseInt(this.input.value);
    const player = this.active[this.currentPlayerIndex];

    const minBid = this.highestBidder ? this.highestBid + 1 : this.tile.price;

    if (isNaN(value) || value < minBid || value > player.balance) {
      this.errorBox.textContent = 'Ставка не валідна';
      return;
    }

    this.errorBox.textContent = '';

    this.highestBid = value;
    this.highestBidder = player;
    this.bids.set(player, value);
    this.#nextPlayer(resolve);
  }

  #handlePass(resolve) {
    const player = this.active[this.currentPlayerIndex];
    this.passed.add(player);
    this.#nextPlayer(resolve);
  }

  #nextPlayer(resolve) {
    const activePlayers = this.#getActivePlayers();

    if (
      activePlayers.length === 1 &&
      this.highestBidder &&
      activePlayers[0] === this.highestBidder
    ) {
      this.modalManager.close();
      resolve({ winner: this.highestBidder, price: this.highestBid });
      return;
    }

    if (activePlayers.length === 0) {
      this.modalManager.close();
      resolve({ winner: null, price: null });
      return;
    }

    do {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.active.length;
    } while (this.passed.has(this.active[this.currentPlayerIndex]));

    this.#updateInfo();
  }

  #getActivePlayers() {
    return this.active.filter((p) => !this.passed.has(p));
  }

  #updateInfo() {
    const player = this.active[this.currentPlayerIndex];

    const hasBid = this.highestBidder !== null;
    const currentBidText = hasBid ? `${this.highestBid}₴` : 'немає';

    const minBid = hasBid ? this.highestBid + 1 : this.tile.price;

    this.info.innerHTML = `
      <p><strong>Мінімальна ставка:</strong> ${minBid}₴</p>
      <p><strong>Поточна ставка:</strong> ${currentBidText}</p>
      <p><strong>Хід гравця:</strong> ${player.name}</p>
    `;
    this.input.value = '';
    this.input.focus();
    this.#bindMoneyLimits(player);
  }
}
