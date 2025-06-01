export class AuctionQueue {
  constructor() {
    this.items = [];
    this.counter = 0;
  }

  enqueue(item, priority) {
    this.items.push({ item, priority, order: this.counter++ });
  }

  peek(mode) {
    if (this.items.length === 0) return null;
    if (mode === 'highest') {
      return this.items.reduce((max, curr) =>
        curr.priority > max.priority ||
        (curr.priority === max.priority && curr.order < max.order)
          ? curr
          : max,
      );
    }
    if (mode === 'lowest') {
      return this.items.reduce((min, curr) =>
        curr.priority < min.priority ||
        (curr.priority === min.priority && curr.order < min.order)
          ? curr
          : min,
      );
    }
    if (mode === 'oldest') {
      return this.items.reduce((old, curr) =>
        curr.order < old.order ? curr : old,
      );
    }
    if (mode === 'newest') {
      return this.items.reduce((newest, curr) =>
        curr.order > newest.order ? curr : newest,
      );
    }
    throw new Error(`Невідомий режим: ${mode}`);
  }

  dequeue(mode) {
    const target = this.peek(mode);
    if (!target) return null;
    const index = this.items.indexOf(target);
    return this.items.splice(index, 1)[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
    this.counter = 0;
  }
}
