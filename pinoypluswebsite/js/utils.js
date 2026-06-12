export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function firstName(name) {
  return name.split(" ")[0];
}

export function pickRandom(items, count) {
  return shuffleArray(items).slice(0, Math.min(count, items.length));
}
