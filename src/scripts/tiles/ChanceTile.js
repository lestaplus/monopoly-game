import BaseTile from './BaseTile.js';

class ChanceTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player, players, context) {
    const cardManager = context?.cardManager;
    if (!cardManager) {
      throw new Error('cardManager не передано в activate()');
    }

    const roll = cardManager.rollDice();
    const card = cardManager.draw('chance', roll);
    cardManager.apply(card, player, context);
  }
}

export default ChanceTile;
