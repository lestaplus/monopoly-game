export function startAuction(tile, players) {
  const MIN_BID = 10;

  alert(`${tile.name} виставлено на аукціон. Мінімальна ставка: 10₴`);

  let highestBid = MIN_BID - 1;
  let highestBidder = null;
  let activePlayers = players.slice();

  while (activePlayers.length > 0) {
    let i = 0;

    while (i < activePlayers.length) {
      const player = activePlayers[i];
      const minBid = highestBid + 1;
      const maxBid = player.balance;

      if (maxBid < minBid) {
        alert(
          `${player.name} не має достатньо коштів для мінімальної ставки (${minBid}₴).`,
        );
        activePlayers.splice(i, 1);
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
        i++;
      } else {
        alert(`${player.name} пропускає ставку.`);
        activePlayers.splice(i, 1);
      }

      if (activePlayers.length === 1 && highestBid >= MIN_BID) {
        const lastPlayer = activePlayers[0];
        const confirmBid = confirm(
          `${lastPlayer.name}, ти єдиний учасник. Бажаєш купити ${tile.name} за ${highestBid}₴?`,
        );

        if (confirmBid) {
          highestBidder = lastPlayer;
        } else {
          highestBidder = null;
        }

        activePlayers = [];
        break;
      }
    }
  }

  if (!highestBidder || highestBid < MIN_BID) {
    alert(
      `Ніхто не зробив дійсну ставку, тому власність залишається без власника.`,
    );
    return;
  }

  highestBidder.changeBalance(-highestBid);
  highestBidder.addProperty(tile);
  tile.owner = highestBidder;

  alert(
    `${highestBidder.name} виграв аукціон та купив ${tile.name} за ${highestBid}₴. Баланс: ${highestBidder.balance}₴`,
  );
}
