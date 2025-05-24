import ModalManager from './ModalManager.js';
import PurchaseModal from './modals/PurchaseModal.js';
import NoFundsModal from './modals/NoFundsModal.js';
import TradeModal from './modals/TradeModal.js';
import AuctionModal from './modals/AuctionModal.js';
import TurnModal from './modals/TurnModal.js';
import MessageModal from './modals/MessageModal.js';

const modalManager = new ModalManager();

export const modalService = {
  modalManager,
  purchaseModal: new PurchaseModal(modalManager),
  noFundsModal: new NoFundsModal(modalManager),
  tradeModal: new TradeModal(modalManager),
  auctionModal: new AuctionModal(modalManager),
  turnModal: new TurnModal(modalManager),
  messageModal: new MessageModal(modalManager),
};
