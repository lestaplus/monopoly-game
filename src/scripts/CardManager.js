class CardManager {
  constructor(tiles) {
    this.tiles = tiles;
    this.chanceCards = [];
    this.communityCards = [];
  }

  async loadCards() {
    const [chanceRes, communityRes] = await Promise.all([
      fetch('src/data/chance.json'),
      fetch('src/data/community.json'),
    ]);
    this.chanceCards = await chanceRes.json();
    this.communityCards = await communityRes.json();
  }

  rollDice() {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;
    const thirdDice = Math.floor(Math.random() * 6) + 1;
    const total = firstDice + secondDice + thirdDice;

    alert(`Випало ${firstDice} + ${secondDice} + ${thirdDice} = ${total}`);
    return total;
  }

  draw(type, roll) {
    const deck = type === 'chance' ? this.chanceCards : this.communityCards;
    const index = Math.min(deck.length - 1, roll - 3);
    return deck[index];
  }

  apply(card, player, context) {
    alert(card.text);
    const action = this.cardHandlers[card.action];
    if (action) action(card, player, this.tiles);

    context.board.updatePlayerPositions(context.players);
  }

  cardHandlers = {
    pay: (card, player) => player.setBalance(-card.amount),
    receive: (card, player) => player.setBalance(card.amount),
    goToJail: (_, player) => player.goToJail(),
    getOutOfJailKey: (_, player) => {
      if (player.hasJailKey) {
        alert(`${player.name} вже має ключ від в'язниці.`);
      } else {
        player.hasJailKey = true;
        alert(`${player.name} отримує ключ від в'язниці.`);
      }
    },
    skipTurn: (_, player) => (player.skipTurn = true),
    move: (card, player, tiles) => {
      if ('position' in card) {
        player.setPosition(card.position);
      } else if ('relative' in card) {
        player.setPosition(
          (player.position + card.relative + tiles.length) % tiles.length,
        );
      } else if ('toTile' in card) {
        const tile = tiles.find((t) => t.name === card.toTile);
        if (tile) player.setPosition(tile.index);
      } else if ('toNearest' in card) {
        let offset = 1;
        while (offset < tiles.length) {
          const next = (player.position + offset) % tiles.length;
          if (tiles[next].type === card.toNearest) {
            player.setPosition(next);
            break;
          }
          offset++;
        }
      }
    },
  };
}

export default CardManager;
