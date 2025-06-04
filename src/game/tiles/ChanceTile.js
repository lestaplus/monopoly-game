import BaseTile from './BaseTile.js';
import { drawCard } from '../eventCards.js';

class ChanceTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  async activate(player, players, context) {
    const { board, modals } = context;

    const card = drawCard('chance');
    await modals.messageModal.show({
      title: 'Шанс',
      message: card.text,
    });
    this.#applyCardEvent(card, player, board);
  }

  #applyCardEvent(card, player, board) {
    switch (card.action) {
      case 'move':
        this.#handleMove(card, player, board);
        break;
      case 'goToJail':
        player.goToJail();
        player.gameNotifier.message(
          `${player.name} відправляється до в'язниці через подію.`,
        );
        break;
      case 'skipTurn':
        player.skipTurn = true;
        player.gameNotifier.message(
          `${player.name} пропускає наступний хід через подію.`,
        );
        break;
      case 'getOutOfJailKey':
        if (player.hasJailKey) {
          player.gameNotifier.message(
            `${player.name} вже має ключ від в'язниці. Другий ключ подія не дає.`,
          );
        } else {
          player.hasJailKey = true;
          player.ui.showJailKey();
          player.gameNotifier.message(
            `${player.name} отримує ключ від в'язниці через подію.`,
          );
        }
        break;
    }
  }

  #handleMove(card, player, board) {
    const total = board.tiles.length;
    let newPosition = player.position;

    if ('toTile' in card) {
      const index = board.tiles.findIndex((tile) => tile.name === card.toTile);
      if (index !== -1) {
        newPosition = index;
      }
    } else if ('relative' in card) {
      newPosition = (player.position + card.relative + total) % total;
    } else if ('toNearest' in card) {
      for (let i = 1; i < total; i++) {
        const index = (player.position + i) % total;
        if (board.tiles[index].type === card.toNearest) {
          newPosition = index;
          break;
        }
      }
    }

    player.position = newPosition;
    const targetTile = board.tiles[newPosition];
    player.gameNotifier.message(
      `${player.name} переміщується на поле "${targetTile.name}" через подію.`,
    );
  }
}

export default ChanceTile;
