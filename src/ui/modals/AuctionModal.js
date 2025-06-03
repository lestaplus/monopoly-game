import { AuctionQueue } from '../../utils/AuctionQueue.js';

export default class AuctionModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(tile, players) {
    this.tile = tile;
    this.players = [...players];
    this.bids = new AuctionQueue();
    this.passed = new Set();
    this.bidders = new Set();
    this.currentPlayerIndex = 0;

    const container = this.#createContainer();
    this.modalManager.open(container);
    this.modalManager.setModalBlocked(true);
    this.modalManager.setPlayerMenuDisabled(true);
    this.#updateInfo(container);

    return new Promise((resolve) => {
      this.resolveAuction = resolve;
      this.#bindHandlers(container);
    });
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'auction-modal';

    container.innerHTML = `
      <div class="auction-main">
        <h2 class="auction-title">Аукціон: ${this.tile.name}</h2>
        <div class="auction-info" id="auction-info"></div>
        <input type="number" class="auction-input" id="auction-input" placeholder="Ваша ставка">
        <div class="auction-error" id="auction-error"></div>
        <div class="auction-actions">
          <button id="bid-btn-auction">Ставка</button>
          <button id="pass-btn-auction">Пропустити</button>
        </div>
      </div>
      <div class="auction-history-block">
        <h3>Історія ставок:</h3>
        <div class="auction-history" id="auction-history"></div>
      </div>
    `;

    return container;
  }

  #bindHandlers(container) {
    const bidBtn = container.querySelector('#bid-btn-auction');
    const passBtn = container.querySelector('#pass-btn-auction');

    bidBtn.addEventListener('click', () => this.#handleBid(container));
    passBtn.addEventListener('click', () => this.#handlePass(container));

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

  #handleBid(container) {
    const input = container.querySelector('#auction-input');
    const errorBox = container.querySelector('#auction-error');
    const player = this.players[this.currentPlayerIndex];
    const value = parseInt(input.value);

    const currentHighest = this.bids.peek('highest');
    const minBid = currentHighest
      ? currentHighest.priority + 1
      : this.tile.price;

    if (isNaN(value) || value < minBid || value > player.balance) {
      errorBox.textContent = `Ставка не валідна`;
      return;
    }

    this.bids.enqueue(player, value);
    this.bidders.add(player);

    this.#nextPlayer(container);
  }

  #handlePass(container) {
    const player = this.players[this.currentPlayerIndex];
    this.passed.add(player);
    this.#nextPlayer(container);
  }

  #nextPlayer(container) {
    const remaining = this.players.filter((p) => !this.passed.has(p));

    if (
      remaining.length === 1 &&
      this.bidders.has(remaining[0]) &&
      this.passed.size > 0
    ) {
      if (this.bids.isEmpty()) {
        this.#finishAuction(null);
      } else {
        const bestBid = this.bids.dequeue('highest');
        this.#finishAuction(bestBid);
      }
      return;
    }

    if (remaining.length === 0) {
      this.#finishAuction(null);
      return;
    }

    do {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.passed.has(this.players[this.currentPlayerIndex]));

    this.#updateInfo(container);
  }

  #finishAuction(bestBid) {
    this.modalManager.close();
    this.modalManager.setModalBlocked(false);
    this.modalManager.setPlayerMenuDisabled(false);
    if (bestBid) {
      this.resolveAuction({ winner: bestBid.item, price: bestBid.priority });
    } else {
      this.resolveAuction({ winner: null, price: null });
    }
    this.bids.clear();
    this.passed.clear();
    this.bidders.clear();
  }

  #updateInfo(container) {
    const info = container.querySelector('#auction-info');
    const history = container.querySelector('#auction-history');
    const input = container.querySelector('#auction-input');
    const errorBox = container.querySelector('#auction-error');
    const player = this.players[this.currentPlayerIndex];

    const currentHighest = this.bids.peek('highest');
    const currentLowest = this.bids.peek('lowest');
    const lastBid = this.bids.peek('newest');

    const minBid = currentHighest
      ? currentHighest.priority + 1
      : this.tile.price;

    info.innerHTML = `
      <p><strong>Мінімальна ставка:</strong> ${minBid}₴</p>
      <p><strong>Поточна ставка:</strong> ${currentHighest ? currentHighest.priority + '₴' : 'немає'}</p>
      <p><strong>Найнижча ставка:</strong> ${currentLowest ? currentLowest.priority + '₴' : 'немає'}</p>
      <p><strong>Остання ставка від:</strong> ${lastBid ? lastBid.item.name + ' - ' + lastBid.priority + '₴' : 'немає'}</p>
      <p><strong>Хід гравця:</strong> ${player.name}</p>
    `;

    const historyItems = this.bids.items
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(
        (bid, i) => `<li>#${i + 1}: ${bid.item.name} - ${bid.priority}₴</li>`,
      )
      .join('');

    history.innerHTML = historyItems
      ? `<ul>${historyItems}</ul>`
      : '<p>Ставок ще немає.</p>';
    history.scrollTop = history.scrollHeight;

    input.value = '';
    input.min = '0';
    input.max = player.balance;
    input.focus();

    errorBox.textContent = '';
  }
}
