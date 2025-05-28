export function timeoutIterator(iterator, seconds, callback, interval = 100) {
  const start = Date.now();
  const duration = seconds * 1000;

  const iterate = () => {
    if (Date.now() - start >= duration) {
      return;
    }

    const { value } = iterator.next();
    callback(value);
    setTimeout(iterate, interval);
  };

  iterate();
}
