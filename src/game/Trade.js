class Trade {
  #players;

  constructor(players) {
    this.#players = players;
  }

  async startTrade(currentPlayerIndex, tradeModal) {
    const result = await tradeModal.show(this.players, currentPlayerIndex);
    if (!result) {
      console.log('Торгівлю скасовано.');
      return;
    }

    this.#executeTrade(result);
    console.log('Торгівлю завершено.');
  }

  #executeTrade(result) {
    const { from, to } = result;
    const fromPlayer = this.#players[from.fromIndex];
    const toPlayer = this.#players[to.toIndex];

    this.#transferProperties(fromPlayer, toPlayer, from.tilesFrom);
    this.#transferProperties(toPlayer, fromPlayer, to.tilesTo);

    this.#transferMoney(fromPlayer, toPlayer, from.moneyFrom, to.moneyTo);
  }

  #transferProperties(player1, player2, tileNames) {
    const props = player1.properties.filter((tile) =>
      tileNames.includes(tile.name),
    );

    props.forEach((tile) => tile.changeOwner(player1, player2));
  }

  #transferMoney(player1, player2, moneyFrom, moneyTo) {
    player1.pay(moneyFrom);
    player1.receive(moneyTo);

    player2.pay(moneyTo);
    player2.receive(moneyFrom);
  }

  get players() {
    return [...this.#players];
  }
}

export default Trade;
