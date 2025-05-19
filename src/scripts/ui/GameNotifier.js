class GameNotifier {
  static #instance = null;
  #element;

  constructor() {
    if (GameNotifier.#instance) {
      throw new Error('Використовуйте GameNotifier.getInstance().');
    }
    this.#element = document.getElementById('game-notifier');
  }

  static getInstance() {
    if (!GameNotifier.#instance) {
      GameNotifier.#instance = new GameNotifier();
    }
    return GameNotifier.#instance;
  }

  message(text) {
    const message = document.createElement('div');
    message.classList.add('notification');
    message.innerText = text;
    this.#element.appendChild(message);
  }
}

export default GameNotifier;
