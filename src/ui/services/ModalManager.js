export default class ModalManager {
  constructor() {
    this.modal = document.getElementById('modal');
    this.modalBody = document.getElementById('modal-body');
    this.stack = [];
    this.isModalBlocked = false;
  }

  open(contentElement) {
    if (this.modalBody.firstChild) {
      this.stack.push(this.modalBody.firstChild);
    }

    this.modalBody.innerHTML = '';
    this.modalBody.appendChild(contentElement);
    this.modal.classList.remove('hidden');
  }

  close() {
    this.modalBody.innerHTML = '';
    const previous = this.stack.pop();

    if (previous) {
      this.modalBody.appendChild(previous);
      this.modal.classList.remove('hidden');
    } else {
      this.modal.classList.add('hidden');
    }
  }

  clearStack() {
    this.stack = [];
  }

  setModalBlocked(state) {
    this.isModalBlocked = state;
  }

  getModalBlocked() {
    return this.isModalBlocked;
  }

  setPlayerMenuDisabled(disabled) {
    const buttons = document.querySelectorAll('.player-menu button');
    buttons.forEach((btn) => {
      btn.disabled = !!disabled;
    });
  }
}
