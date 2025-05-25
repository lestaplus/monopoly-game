export default class MessageModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(message) {
    const container = this.#createContainer(message);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandler(container, resolve);
    });
  }

  #createContainer(message) {
    const container = document.createElement('div');
    container.className = 'message-modal';

    container.innerHTML = `
      <p class="modal-text">${message}</p>
      <div class="message-actions">
        <button id="continue-btn">Продовжити</button>
      </div>
    `;

    return container;
  }

  #bindHandler(container, resolve) {
    const continueBtn = container.querySelector('#continue-btn');
    continueBtn.addEventListener(
      'click',
      () => {
        this.#handleContinue(resolve);
      },
      { once: true },
    );
  }

  #handleContinue(resolve) {
    this.modalManager.close();
    resolve();
  }
}
