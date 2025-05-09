import { startAuction } from './auction.js';

export function handleProperty(player, tile, players) {
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
        alert(`${player.name} не має достатньо грошей. Починаємо аукціон.`);
        startAuction(tile, players);
      }
    } else {
      alert(`${player.name} не купив ${tile.name}. Починаємо аукціон.`);
      startAuction(tile, players);
    }
  } else if (tile.owner !== player) {
    const rent = Math.floor(tile.price * 0.1);
    player.setBalance(-rent);
    tile.owner.setBalance(rent);
    alert(
      `${player.name} сплачує ${rent}₴ за оренду власності гравцю ${tile.owner.name}. Баланс: ${player.balance}₴`,
    );
  } else {
    alert(`${player.name} вже володіє ${tile.name}.`);
  }
}

export function handleRailroad(player, tile, players) {
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
        alert(`${player.name} не має достатньо грошей. Починаємо аукціон.`);
        startAuction(tile, players);
      }
    } else {
      alert(`${player.name} не купив ${tile.name}. Починаємо аукціон.`);
      startAuction(tile, players);
    }
  } else if (tile.owner !== player) {
    const ownerRailroads = tile.owner.properties.filter(
      (p) => p.type === 'railroad',
    ).length;
    const rentMap = { 1: 250, 2: 500, 3: 1000, 4: 2000 };
    const rent = rentMap[ownerRailroads] || 250;

    player.setBalance(-rent);
    tile.owner.setBalance(rent);
    alert(
      `${player.name} сплачує ${rent}₴ за оренду залізниці гравцю ${tile.owner.name}. Баланс: ${player.balance}₴`,
    );
  } else {
    alert(`${player.name} вже володіє залізницею.`);
  }
}

export function handleUtility(player, tile, players) {
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
        alert(`${player.name} не має достатньо грошей. Починаємо аукціон.`);
        startAuction(tile, players);
      }
    } else {
      alert(`${player.name} не купив ${tile.name}. Починаємо аукціон.`);
      startAuction(tile, players);
    }
  } else if (tile.owner !== player) {
    const ownerUtilities = tile.owner.properties.filter(
      (p) => p.type === 'utility',
    ).length;
    const dice =
      Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
    const multiplier = ownerUtilities === 2 ? 100 : 40;
    const rent = dice * multiplier;

    player.setBalance(-rent);
    tile.owner.setBalance(rent);
    alert(
      `${player.name} сплачує ${rent}₴ (${multiplier}x) за комунальні послуги гравцю ${tile.owner.name}. Баланс: ${player.balance}₴`,
    );
  } else {
    alert(`${player.name} вже володіє комунальним підприємством.`);
  }
}

let cardManager;

export function setCardManager(manager) {
  cardManager = manager;
}

export function handleChance(player) {
  const roll = cardManager.rollDice();
  const card = cardManager.draw('chance', roll);
  cardManager.apply(card, player);
  gameInstance.board.updatePlayerPositions(gameInstance.players);
}

export function handleCommunity(player) {
  const roll = cardManager.rollDice();
  const card = cardManager.draw('community', roll);
  cardManager.apply(card, player);
  gameInstance.board.updatePlayerPositions(gameInstance.players);
}

export function handleTax(player, tile) {
  const amount = tile.amount;
  player.setBalance(-amount);
  alert(
    `${player.name} сплачує податок ${amount}₴. Баланс: ${player.balance}₴`,
  );
}

export function handleCasino(player) {
  const wantsToPlay = confirm('Тобі випала можливість зіграти в казино.');

  if (!wantsToPlay) {
    alert(`${player.name} відмовляється від гри в казино.`);
    return;
  }

  const bidAmount = prompt(
    `${player.name}, введіть ставку (макс. 5000₴):`,
    '0',
  );
  const bid = parseInt(bidAmount);

  if (isNaN(bid) || bid < 0 || bid > 5000) {
    alert('Невірна ставка. Казино скасовано.');
    return;
  }

  const outcomes = [
    { multiplier: 0, chance: 3 },
    { multiplier: 0.5, chance: 2 },
    { multiplier: 1, chance: 3 },
    { multiplier: 2, chance: 1.5 },
    { multiplier: 3, chance: 0.5 },
    { multiplier: 5, chance: 0.3 },
    { multiplier: 10, chance: 0.1 },
  ];

  const totalChance = outcomes.reduce((sum, o) => sum + o.chance, 0);
  const random = Math.random() * totalChance;
  let acc = 0;
  let result = outcomes[0];

  for (const outcome of outcomes) {
    acc += outcome.chance;
    if (random <= acc) {
      result = outcome;
      break;
    }
  }

  const prize = Math.floor(bid * result.multiplier);
  player.setBalance(-bid + prize);

  alert(
    `${player.name} поставив ${bid}₴ і виграв ${prize}₴. Баланс: ${player.balance}₴`,
  );
}

export function handleJail(player) {
  alert(`${player.name} просто відвідує в'язницю.`);
}

export function handleGoToJail(player) {
  player.goToJail();
  alert(`${player.name} відправляється до в'язниці!`);
}

let gameInstance;

export function setGameInstance(game) {
  gameInstance = game;
}
