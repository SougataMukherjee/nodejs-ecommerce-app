export function getRandomIndices(start, end, count) {
  const indices = new Set();
  const range = end - start + 1;
  const total = Math.min(count, range);
  while (indices.size < total) {
    indices.add(Math.floor(Math.random() * range) + start);
  }
  return [...indices];
}
