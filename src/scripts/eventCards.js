let chanceGen;
let communityGen;

export async function initCardGenerators() {
  const [chanceRes, communityRes] = await Promise.all([
    fetch('src/data/chance.json'),
    fetch('src/data/community.json'),
  ]);

  const chanceCards = await chanceRes.json();
  const communityCards = await communityRes.json();

  chanceGen = randomCardGenerator(chanceCards);
  communityGen = randomCardGenerator(communityCards);
}

function* randomCardGenerator(cards) {
  while (true) {
    const index = Math.floor(Math.random() * cards.length);
    yield cards[index];
  }
}

export function drawCard(type) {
  if (type === 'chance') {
    return chanceGen.next().value;
  }

  if (type === 'community') {
    return communityGen.next().value;
  }
}
