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

    const { fromIndex, toIndex, moneyFrom, moneyTo, tilesFrom, tilesTo } =
      result;
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

    fromPlayer.changeBalance(-moneyFrom + moneyTo);
    toPlayer.changeBalance(-moneyTo + moneyFrom);

    fromPlayer.updateDisplay();
    toPlayer.updateDisplay();

    console.log('Торгівлю завершено.');
  }
}

export default Trade;
