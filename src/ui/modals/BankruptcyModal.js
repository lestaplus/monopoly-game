export default class BankruptcyModal {
  constructor(modalManager) {
    this.modalManager = modalManager;
  }

  async show(player) {
    const container = this.#createContainer();
    this.modalManager.open(container);

    return new Promise((resolve) => {
      this.#bindHandlers(container, player, resolve);
    });
  }

  #createContainer() {
    const container = document.createElement('div');
    container.className = 'bankruptcy-modal';

    container.innerHTML = `
      <h2>Недостатньо грошей</h2>
      <p>Щоб продовжити гру, закладіть власність або продайте будинки чи готелі.</p>
      <div class="bankruptcy-actions">
        <button id="continue-btn-bankruptcy">Продовжити гру</button>
        <button id="bankruptcy-btn">Здатися</button>
      </div>
    `;

    return container;
  }

  #bindHandlers(container, player, resolve) {
    const continueBtn = container.querySelector('#continue-btn-bankruptcy');
    const bankruptcyBtn = container.querySelector('#bankruptcy-btn');

    const updateButtonState = (balance) => {
      continueBtn.disabled = balance < 0;
    };

    updateButtonState(player.balance);

    const balanceHandler = (balance) => updateButtonState(balance);
    player.events.on('balanceChange', balanceHandler);

    const cleanup = () => {
      player.events.off('balanceChange', balanceHandler);
      continueBtn.removeEventListener('click', onContinue);
      bankruptcyBtn.removeEventListener('click', onBankruptcy);
    };

    const onContinue = () => {
      if (continueBtn.disabled) return;
      cleanup();
      resolve('continue');
      this.modalManager.close();
    };

    const onBankruptcy = () => {
      cleanup();
      resolve('surrender');
      this.modalManager.close();
    };

    continueBtn.addEventListener('click', onContinue);
    bankruptcyBtn.addEventListener('click', onBankruptcy);
  }
}
