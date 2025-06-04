class Trade {
  #game;

  constructor(game) {
    this.#game = game;
  }

  async startTrade(currentPlayerIndex, tradeModal) {
    const result = await tradeModal.show(
      this.#game.players,
      currentPlayerIndex,
    );
    if (!result) {
      console.log('Торгівлю скасовано.');
      return;
    }

    this.#executeTrade(result);
    console.log('Торгівлю завершено.');
  }

  #executeTrade(result) {
    const { from, to } = result;
    const fromPlayer = this.#game.players[from.fromIndex];
    const toPlayer = this.#game.players[to.toIndex];

    this.#transferProperties(fromPlayer, toPlayer, from.tilesFrom);
    this.#transferProperties(toPlayer, fromPlayer, to.tilesTo);

    this.#transferMoney(fromPlayer, toPlayer, from.moneyFrom, to.moneyTo);
  }

  #transferProperties(player1, player2, tileNames) {
    const props = player1.properties.filter((tile) =>
      tileNames.includes(tile.name),
    );

    props.forEach((tile) => {
      const color = tile.color;

      const colorGroupTiles = player1.properties.filter(
        (t) => t.color === color,
      );
      const blocked = colorGroupTiles.some((t) => t.houses > 0 || t.hotel);

      if (blocked) {
        alert(
          `Не можна передати поле, якщо на ньому або на інших полях цієї кольорової групи є будинки або готель.`,
        );
        return;
      }

      tile.changeOwner(player1, player2);
    });
  }

  #transferMoney(player1, player2, moneyFrom, moneyTo) {
    player1.pay(moneyFrom);
    player1.receive(moneyTo);

    player2.pay(moneyTo);
    player2.receive(moneyFrom);
  }
}

export default Trade;
