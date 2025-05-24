export default class MessageModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(message) {
    this.container = this.#createContainer(message);
    this.modalManager.open(this.container);

    return new Promise((resolve) => {
      this.#bindHandler(resolve);
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

  #bindHandler(resolve) {
    const continueBtn = this.container.querySelector('#continue-btn');
    continueBtn?.addEventListener(
      'click',
      () => {
        this.modalManager.close();
        resolve();
      },
      { once: true },
    );
  }
}
