import GameNotifier from './ui/GameNotifier.js';

class CardManager {
  #tiles;
  #chanceCards = [];
  #communityCards = [];

  constructor(tiles) {
    this.#tiles = tiles;
    this.gameNotifier = GameNotifier.getInstance();
  }

  async loadCards() {
    const [chanceRes, communityRes] = await Promise.all([
      fetch('src/data/chance.json'),
      fetch('src/data/community.json'),
    ]);
    this.#chanceCards = await chanceRes.json();
    this.#communityCards = await communityRes.json();
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
    const deck = type === 'chance' ? this.#chanceCards : this.#communityCards;
    const index = Math.min(deck.length - 1, roll - 3);
    return deck[index];
  }

  apply(card, player, context) {
    alert(card.text);
    const action = this.#getHandler(card.action);
    if (action) action.call(this, card, player, this.#tiles);

    context.board.updatePlayerPositions(context.players);
  }

  #getHandler(action) {
    return {
      pay: this.#handlePay,
      receive: this.#handleReceive,
      goToJail: this.#handleGoToJail,
      getOutOfJailKey: this.#handleJailKey,
      skipTurn: this.#handleSkipTurn,
      move: this.#handleMove,
    }[action];
  }

  #handlePay(card, player) {
    player.pay(card.amount);
  }

  #handleReceive(card, player) {
    player.receive(card.amount);
  }

  #handleGoToJail(_, player) {
    player.goToJail();
  }

  #handleJailKey(_, player) {
    if (player.hasJailKey) {
      this.gameNotifier.message(`${player.name} вже має ключ від в'язниці.`);
    } else {
      player.hasJailKey = true;
      this.gameNotifier.message(`${player.name} отримує ключ від в'язниці.`);
    }
  }

  #handleSkipTurn(_, player) {
    player.skipTurn = true;
  }

  #handleMove(card, player, tiles) {
    if ('position' in card) {
      player.position = card.position;
    } else if ('relative' in card) {
      player.position =
        (player.position + card.relative + tiles.length) % tiles.length;
    } else if ('toTile' in card) {
      const tile = tiles.find((t) => t.name === card.toTile);
      if (tile) player.position = tile.index;
    } else if ('toNearest' in card) {
      let offset = 1;
      while (offset < tiles.length) {
        const next = (player.position + offset) % tiles.length;
        if (tiles[next].type === card.toNearest) {
          player.position = next;
          break;
        }
        offset++;
      }
    }
  }
}

export default CardManager;
