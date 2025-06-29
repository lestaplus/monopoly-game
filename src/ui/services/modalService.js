import ModalManager from './ModalManager.js';
import PurchaseModal from '../modals/PurchaseModal.js';
import NoFundsModal from '../modals/NoFundsModal.js';
import TradeModal from '../modals/TradeModal.js';
import AuctionModal from '../modals/AuctionModal.js';
import TurnModal from '../modals/TurnModal.js';
import MessageModal from '../modals/MessageModal.js';
import JailModal from '../modals/JailModal.js';
import DiceModal from '../modals/DiceModal.js';
import PropertyModal from '../modals/PropertyModal.js';
import RailroadModal from '../modals/RailroadModal.js';
import UtilityModal from '../modals/UtilityModal.js';
import BuildPropertyModal from '../modals/BuildPropertyModal.js';
import MortgageModal from '../modals/MortgageModal.js';
import BankruptcyModal from '../modals/BankruptcyModal.js';

const modalManager = new ModalManager();
const diceModal = new DiceModal(modalManager);

export const modalService = {
  modalManager,
  purchaseModal: new PurchaseModal(modalManager),
  noFundsModal: new NoFundsModal(modalManager),
  tradeModal: new TradeModal(modalManager),
  auctionModal: new AuctionModal(modalManager),
  turnModal: new TurnModal(modalManager, diceModal),
  messageModal: new MessageModal(modalManager),
  jailModal: new JailModal(modalManager),
  diceModal: diceModal,
  propertyModal: new PropertyModal(modalManager),
  railroadModal: new RailroadModal(modalManager),
  utilityModal: new UtilityModal(modalManager),
  buildPropertyModal: new BuildPropertyModal(modalManager),
  mortgageModal: new MortgageModal(modalManager),
  bankruptcyModal: new BankruptcyModal(modalManager),
};
