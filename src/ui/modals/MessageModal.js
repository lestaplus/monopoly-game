export default class MessageModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show({ title = 'Повідомлення', message }) {
    const container = this.#createContainer(title, message);
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandler(container, resolve);
    });
  }

  #createContainer(title, message) {
    const container = document.createElement('div');
    container.className = 'message-modal';

    container.innerHTML = `
      <h2>${title}</h2>
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
