import BaseTile from './baseTile.js';

class CommunityTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player, players, context) {
    const cardManager = context?.cardManager;
    if (!cardManager) {
      throw new Error('cardManager не передано в activate()');
    }

    const roll = cardManager.rollDice();
    const card = cardManager.draw('community', roll);
    cardManager.apply(card, player, context);
  }
}

export default CommunityTile;
