export function handleProperty(player, tile) {
  alert(`Це власність: ${tile.name}.`);
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
  player.balance -= amount;
  alert(`${player.name} сплачує податок ${amount}₴. Баланс: ${player.balance}`);
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
