class Trade {
  constructor(players) {
    this.players = players;
  }
  startTrade(fromIndex, toIndex) {
    const from = this.players[fromIndex];
    const to = this.players[toIndex];

    const tilesFrom = this.selectTiles(from);
    const moneyFrom = this.inputMoney(from);

    const tilesTo = this.selectTiles(to);
    const moneyTo = this.inputMoney(to);

    const confirmed = this.confirmTrade(
      from,
      to,
      tilesFrom,
      moneyFrom,
      tilesTo,
      moneyTo,
    );

    if (confirmed) {
      this.applyTrade(from, to, tilesFrom, moneyFrom, tilesTo, moneyTo);
      alert(`Торгівлю завершено успішно!`);
    } else {
      alert(`Торгівлю скасовано.`);
    }
  }

  selectTiles(player) {
    if (player.properties.length === 0) return [];

    const selectedTiles = prompt(
      `${player.name}, введи майно (через кому), яке хочеш передати:\n
            ${player.properties.map((p) => p.name).join(', ')}`,
    );

    const selectedList = selectedTiles
      ? selectedTiles
          .split(',')
          .map((tile) => tile.trim())
          .filter((tile) => tile.length > 0)
      : [];

    return player.properties.filter((p) => selectedList.includes(p.name));
  }

  inputMoney(player) {
    const input = prompt(
      `${player.name}, скільки грошей хочеш додати до торгу?`,
      '0',
    );
    const amount = parseInt(input);

    return isNaN(amount) || amount < 0 || amount > player.balance ? 0 : amount;
  }

  confirmTrade(from, to, tilesFrom, moneyFrom, tilesTo, moneyTo) {
    const total = `
      ${from.name} пропонує:
      - ${tilesFrom.map((tile) => tile.name).join(', ') || 'нічого'}
      - ${moneyFrom}
      
      ${to.name} пропонує:
      - ${tilesTo.map((tile) => tile.name).join(', ') || 'нічого'}
      - ${moneyTo}
      
      ${to.name}, приймаєш торгівлю?
      `;

    return confirm(total);
  }

  applyTrade(from, to, tilesFrom, moneyFrom, tilesTo, moneyTo) {
    tilesFrom.forEach((tile) => {
      from.properties = from.properties.filter((p) => p !== tile);
      to.properties.push(tile);
      tile.owner = to;
    });

    tilesTo.forEach((tile) => {
      to.properties = to.properties.filter((p) => p !== tile);
      from.properties.push(tile);
      tile.owner = from;
    });

    from.changeBalance(-moneyFrom + moneyTo);
    to.changeBalance(-moneyTo + moneyFrom);

    from.updateDisplay();
    to.updateDisplay();
  }
}

export default Trade;
