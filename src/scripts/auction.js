export function startAuction(tile, players) {
  alert(`${tile.name} виставлено на аукціон. Мінімальна ставка: 10₴`);

  let highestBid = 9;
  let highestBidder = null;
  let activePlayers = players.slice();

  while (activePlayers.length > 1) {
    const nextRound = [];

    for (const player of activePlayers) {
      const minBid = highestBid + 1;
      const maxBid = player.balance;

      if (maxBid < minBid) {
        alert(
          `${player.name} не має достатньо коштів для мінімальної ставки (${minBid}₴).`,
        );
        continue;
      }

      const bidInput = prompt(
        `${player.name}, введіть ставку (мін. ${minBid}₴, макс. ${maxBid}₴):`,
        `${minBid}`,
      );
      const bid = parseInt(bidInput);

      if (!isNaN(bid) && bid >= minBid && bid <= maxBid) {
        highestBid = bid;
        highestBidder = player;
        nextRound.push(player);
      } else {
        alert(`${player.name} пропускає ставку.`);
      }
    }

    if (nextRound.length === 0) break;
    activePlayers = nextRound;
  }

  if (!highestBidder) {
    alert(
      `Ніхто не зробив дійсну ставку, тому власність залишається без власника.`,
    );
    return;
  }

  highestBidder.setBalance(-highestBid);
  highestBidder.addProperty(tile);
  tile.owner = highestBidder;

  alert(
    `${highestBidder.name} виграв аукціон та купив ${tile.name} за ${highestBid}₴. Баланс: ${highestBidder.balance}₴`,
  );
}
