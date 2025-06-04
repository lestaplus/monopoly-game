class PlayerUI {
  #name;
  #index;
  #element;
  #keyElement;

  constructor(name, index) {
    this.#name = name;
    this.#index = index;
    this.#element = this.#createPlayerCard();
    this.#keyElement = this.#createKeyElement();
  }

  #createPlayerCard() {
    const container = document.createElement('div');
    container.className = 'player-card';
    container.dataset.index = this.#index;

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = this.#name;

    const balanceEl = document.createElement('div');
    balanceEl.className = 'balance';
    balanceEl.textContent = '';

    container.append(nameEl, balanceEl);
    return container;
  }

  #createKeyElement() {
    const keyEl = document.createElement('div');
    keyEl.className = 'jail-key hidden';
    keyEl.innerHTML = `<img src="/assets/icons/keys/jail-key.svg" class="key-icon" width="30" height="30" alt="Jail Key" />`;

    this.#element.append(keyEl);
    return keyEl;
  }

  updateDisplay(balance) {
    const balanceElement = this.#element.querySelector('.balance');
    if (balanceElement) {
      balanceElement.textContent = `${balance}₴`;
    }
  }

  removePlayerCard() {
    this.#element?.remove();
  }

  showJailKey() {
    this.#keyElement?.classList.remove('hidden');
  }

  hideJailKey() {
    this.#keyElement?.classList.add('hidden');
  }

  setActive(isActive) {
    this.#element.classList.toggle('active', isActive);
  }

  get element() {
    return this.#element;
  }

  get name() {
    return this.#name;
  }

  get index() {
    return this.#index;
  }
}

export default PlayerUI;
