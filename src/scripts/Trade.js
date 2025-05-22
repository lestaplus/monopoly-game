class Trade {
  #players;

  constructor(players) {
    this.#players = players;
  }
  async startTrade(currentPlayerIndex, tradeModal) {
    const result = await tradeModal.show(this.#players, currentPlayerIndex);
    if (!result) {
      console.log('Торгівлю скасовано.');
      return;
    }

    const {
      from: { fromIndex, moneyFrom, tilesFrom },
      to: { toIndex, moneyTo, tilesTo },
    } = result;

    const fromPlayer = this.#players[fromIndex];
    const toPlayer = this.#players[toIndex];

    const propsFrom = fromPlayer.properties.filter((tile) =>
      tilesFrom.includes(tile.name),
    );
    const propsTo = toPlayer.properties.filter((tile) =>
      tilesTo.includes(tile.name),
    );

    propsFrom.forEach((tile) => tile.changeOwner(fromPlayer, toPlayer));
    propsTo.forEach((tile) => tile.changeOwner(toPlayer, fromPlayer));

    fromPlayer.pay(moneyFrom);
    fromPlayer.receive(moneyTo);

    toPlayer.pay(moneyTo);
    toPlayer.receive(moneyFrom);

    console.log('Торгівлю завершено.');
  }
}

export default Trade;
