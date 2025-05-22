export default class TurnModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  show(playerName) {
    const container = this.#createContainer(playerName);
    this.modalManager.open(container);
    this.#waitForRoll();
  }

  #createContainer(playerName) {
    const container = document.createElement('div');
    container.className = 'turn-modal';
    container.innerHTML = `
      <h2>Хід гравця</h2>
      <p class="turn-name">${playerName}</p>
      <p class="roll-hint">Кидайте кубики</p>
    `;
    return container;
  }

  #waitForRoll() {
    const diceBtn = document.getElementById('dice-btn');

    diceBtn?.addEventListener(
      'click',
      () => {
        const modalContent = this.modalManager.modalBody.firstChild;
        if (modalContent?.classList.contains('turn-modal')) {
          this.modalManager.close();
        }
      },
      { once: true },
    );
  }
}
