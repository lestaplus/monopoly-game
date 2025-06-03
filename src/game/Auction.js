import GameNotifier from '../ui/services/GameNotifier.js';

class Auction {
  constructor(modalService) {
    this.modalService = modalService;
    this.gameNotifier = GameNotifier.getInstance();
  }

  async start(tile, players) {
    const { winner, price } = await this.modalService.auctionModal.show(
      tile,
      players,
    );

    if (!winner || !price || price < tile.price) {
      this.gameNotifier.message(
        `Поле "${tile.name}" залишається без власника.`,
      );
      return;
    }

    tile.assignOwner(winner);
    winner.pay(price);

    this.gameNotifier.message(
      `${winner.name} виграє аукціон і купує поле "${tile.name}" за ${price}₴.`,
    );
  }
}

export default Auction;
