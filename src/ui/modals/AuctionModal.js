export default class AuctionModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile, players) {
    this.tile = tile;
    this.players = [...players];
    this.bids = new Map();
    this.passed = new Set();
    this.currentPlayerIndex = 0;
    this.highestBid = tile.price;
    this.highestBidder = null;

    const container = this.#createContainer();
    this.modalManager.open(container);
    this.#updateInfo(container);

    return new Promise((resolve) => {
      this.#bindHandlers(container, resolve);
    });
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'auction-modal';

    container.innerHTML = `
      <h2 class="auction-title">Аукціон: ${this.tile.name}</h2>
      <div class="auction-info" id="auction-info"></div>
      <input type="number" class="auction-input" id="auction-input" placeholder="Ваша ставка">
      <div class="auction-error" id="auction-error"></div>
      <div class="auction-actions">
        <button class="bid-btn" id="bid-btn">Ставка</button>
        <button class="pass-btn" id="pass-btn">Пропустити</button>
      </div>
    `;

    return container;
  }

  #bindHandlers(container, resolve) {
    const bidBtn = container.querySelector('#bid-btn');
    const passBtn = container.querySelector('#pass-btn');

    bidBtn.addEventListener('click', () => this.#handleBid(container, resolve));
    passBtn.addEventListener('click', () =>
      this.#handlePass(container, resolve),
    );

    const input = container.querySelector('#auction-input');
    input.addEventListener('input', () => this.#validateInput(container));
  }

  #validateInput(container) {
    const input = container.querySelector('#auction-input');
    const errorBox = container.querySelector('#auction-error');
    const player = this.players[this.currentPlayerIndex];

    errorBox.textContent = '';

    let value = parseInt(input.value);

    if (isNaN(value) || value < 0) value = 0;
    if (value > player.balance) value = player.balance;
    input.value = String(value);
  }

  #handleBid(container, resolve) {
    const input = container.querySelector('#auction-input');
    const errorBox = container.querySelector('#auction-error');
    const player = this.players[this.currentPlayerIndex];
    const value = parseInt(input.value);

    const minBid = this.highestBidder ? this.highestBid + 1 : this.tile.price;

    if (isNaN(value) || value < minBid || value > player.balance) {
      errorBox.textContent = `Ставка не валідна`;
      return;
    }

    this.highestBid = value;
    this.highestBidder = player;
    this.bids.set(player, value);

    this.#nextPlayer(container, resolve);
  }

  #handlePass(container, resolve) {
    const player = this.players[this.currentPlayerIndex];
    this.passed.add(player);
    this.#nextPlayer(container, resolve);
  }

  #nextPlayer(container, resolve) {
    const remaining = this.players.filter((p) => !this.passed.has(p));

    if (remaining.length === 1 && this.highestBidder === remaining[0]) {
      this.modalManager.close();
      resolve({ winner: this.highestBidder, price: this.highestBid });
      return;
    }

    if (remaining.length === 0) {
      this.modalManager.close();
      resolve({ winner: null, price: null });
      return;
    }

    do {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.passed.has(this.players[this.currentPlayerIndex]));

    this.#updateInfo(container);
  }

  #updateInfo(container) {
    const info = container.querySelector('#auction-info');
    const input = container.querySelector('#auction-input');
    const errorBox = container.querySelector('#auction-error');
    const player = this.players[this.currentPlayerIndex];
    const minBid = this.highestBidder ? this.highestBid + 1 : this.tile.price;

    info.innerHTML = `
      <p><strong>Мінімальна ставка:</strong> ${minBid}₴</p>
      <p><strong>Поточна ставка:</strong> ${this.highestBidder ? this.highestBid + '₴' : 'немає'}</p>
      <p><strong>Хід гравця:</strong> ${player.name}</p>
    `;

    input.value = '';
    input.min = '0';
    input.max = player.balance;
    input.focus();

    errorBox.textContent = '';
  }
}
