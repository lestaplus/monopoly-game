import { modalService } from '../../ui/services/modalService.js';
import GameNotifier from '../../ui/services/GameNotifier.js';

export async function startAuction(tile, players, ui) {
  ui.disableButton('trade-btn');
  const { winner, price } = await modalService.auctionModal.show(tile, players);
  const gameNotifier = GameNotifier.getInstance();

  if (!winner || !price || price < tile.price) {
    gameNotifier.message(`Поле "${tile.name}" залишається без власника.`);
    ui.enableButton('trade-btn');
    return;
  }

  tile.assignOwner(winner);
  winner.pay(price);

  gameNotifier.message(
    `${winner.name} виграє аукціон і купує поле "${tile.name}" за ${price}₴.`,
  );
  ui.enableButton('trade-btn');
}
