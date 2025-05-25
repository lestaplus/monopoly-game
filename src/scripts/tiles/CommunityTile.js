import BaseTile from './BaseTile.js';
import { drawCard } from '../eventCards.js';

class CommunityTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const { modals } = context;

    const card = drawCard('community');
    await modals.messageModal.show(card.text);
    this.#applyCardEvent(card, player);
  }

  #applyCardEvent(card, player) {
    switch (card.action) {
      case 'pay':
        player.pay(card.amount);
        break;
      case 'receive':
        player.receive(card.amount);
        break;
      case 'skipTurn':
        player.skipNextTurn = true;
        break;
    }
  }
}

export default CommunityTile;
