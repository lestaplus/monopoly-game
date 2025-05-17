import { modalService } from './ui/modalService.js';

export async function startAuction(tile, players) {
  const { winner, price } = await modalService.auctionModal.show(tile, players);

  if (!winner || !price || price < tile.price) {
    console.log(`Поле ${tile.name} залишилось без власника.`);
    return;
  }

  tile.assignOwner(winner, price);
  console.log(
    `${winner.name} виграв аукціон і купив ${tile.name} за ${price}₴.`,
  );
}
