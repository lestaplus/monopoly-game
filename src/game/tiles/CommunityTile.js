import BaseTile from './BaseTile.js';
import { drawCard } from '../eventCards.js';

class CommunityTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const { modals } = context;

    const card = drawCard('community');
    await modals.messageModal.show({
      title: 'Громадська скарбниця',
      message: card.text,
    });
    this.#applyCardEvent(card, player);
  }

  #applyCardEvent(card, player) {
    switch (card.action) {
      case 'pay':
        player.pay(card.amount);
        player.gameNotifier.message(
          `${player.name} сплачує ${card.amount}₴ через подію.`,
        );
        break;
      case 'receive':
        player.receive(card.amount);
        player.gameNotifier.message(
          `${player.name} отримує ${card.amount}₴ через подію.`,
        );
        break;
      case 'skipTurn':
        player.skipTurn = true;
        player.gameNotifier.message(
          `${player.name} пропускає наступний хід через подію.`,
        );
        break;
    }
  }
}

export default CommunityTile;
