import BaseTile from './BaseTile.js';
import { drawCard } from '../eventCards.js';

class ChanceTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const { board, modals } = context;

    const card = drawCard('chance');
    await modals.messageModal.show(card.text);
    this.#applyCardEvent(card, player, board);
  }

  #applyCardEvent(card, player, board) {
    switch (card.action) {
      case 'move':
        this.#handleMove(card, player, board);
        break;
      case 'goToJail':
        player.goToJail();
        break;
      case 'skipTurn':
        player.skipNextTurn = true;
        break;
      case 'getOutOfJailKey':
        player.hasJailKey = true;
        break;
    }
  }

  #handleMove(card, player, board) {
    const total = board.tiles.length;

    if ('toTile' in card) {
      const index = board.tiles.findIndex((tile) => tile.name === card.toTile);
      if (index !== -1) {
        player.position = index;
      }
    } else if ('relative' in card) {
      player.position = (player.position + card.relative + total) % total;
    } else if ('toNearest' in card) {
      for (let i = 1; i < total; i++) {
        const index = (player.position + i) % total;
        if (board.tiles[index].type === card.toNearest) {
          player.position = index;
          break;
        }
      }
    }
  }
}

export default ChanceTile;
