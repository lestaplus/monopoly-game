export default class ModalManager {
  constructor() {
    this.modal = document.getElementById('modal');
    this.modalBody = document.getElementById('modal-body');
  }

  open(content) {
    this.modalBody.innerHTML = content;
    this.modal.classList.remove('hidden');
  }

  close() {
    this.modal.classList.add('hidden');
    this.modalBody.innerHTML = '';
  }
}
