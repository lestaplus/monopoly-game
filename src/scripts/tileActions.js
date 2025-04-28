export function handleProperty(player, tile) {
  if (!tile.owner) {
    const wantsToBuy = confirm(
      `${player.name}, хочеш купити ${tile.name} за ${tile.price}₴?`,
    );

    if (wantsToBuy) {
      if (player.balance >= tile.price) {
        player.setBalance(-tile.price);
        player.addProperty(tile);
        tile.owner = player;
        alert(`${player.name} купив ${tile.name}. Баланс: ${player.balance}₴`);
      } else {
        alert(`${player.name} не має достатньо грошей.`);
      }
    }
  } else if (tile.owner !== player) {
    const rent = Math.floor(tile.price * 0.1);
    player.setBalance(-rent);
    tile.owner.setBalance(rent);
    alert(
      `${player.name} сплачує ${rent}₴ оренди гравцю ${tile.owner.name}. Баланс: ${player.balance}₴`,
    );
  } else {
    alert(`${player.name} вже володіє ${tile.name}.`);
  }
}

export function handleRailroad(player, tile) {
  alert(`Це залізниця: ${tile.name}.`);
}

export function handleUtility(player, tile) {
  alert(`Це комунальна власність: ${tile.name}.`);
}

export function handleChance(player, tile) {
  alert(`Шанс!`);
}

export function handleCommunity(player, tile) {
  alert(`Громадська скарбниця!`);
}

export function handleTax(player, tile) {
  const amount = tile.amount;
  player.setBalance(-amount);
  alert(
    `${player.name} сплачує податок ${amount}₴. Баланс: ${player.balance}₴`,
  );
}

export function handleCasino(player, tile) {
  alert(`Казино`);
}

export function handleJail(player, tile) {
  alert(`Відвідування в'язниці`);
}

export function handleGoToJail(player, tile) {
  alert(`Відправляйтесь до в'язниці!`);
}
