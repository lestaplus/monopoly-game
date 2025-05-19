import BaseTile from './BaseTile.js';

class CasinoTile extends BaseTile {
  constructor(data) {
    super(data);
  }

  activate(player) {
    const wantsToPlay = confirm('Тобі випала можливість зіграти в казино.');

    if (!wantsToPlay) {
      this.gameNotifier.message(
        `${player.name} відмовляється від гри в казино.`,
      );
      return;
    }

    const bidAmount = prompt(
      `${player.name}, введіть ставку (макс. 500₴):`,
      '0',
    );
    const bid = parseInt(bidAmount);

    if (isNaN(bid) || bid < 0 || bid > 500) {
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
    player.changeBalance(-bid + prize);

    this.gameNotifier.message(
      `${player.name} поставив ${bid}₴ і виграв ${prize}₴.`,
    );
  }
}

export default CasinoTile;
