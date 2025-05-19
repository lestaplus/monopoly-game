import { modalService } from './ui/modalService.js';
import GameNotifier from './ui/GameNotifier.js';

export async function startAuction(tile, players) {
  const { winner, price } = await modalService.auctionModal.show(tile, players);
  const gameNotifier = GameNotifier.getInstance();

  if (!winner || !price || price < tile.price) {
    gameNotifier.message(`Поле ${tile.name} залишилось без власника.`);
    return;
  }

  tile.assignOwner(winner);
  winner.changeBalance(-price);

  gameNotifier.message(
    `${winner.name} виграв аукціон і купив ${tile.name} за ${price}₴.`,
  );
}
