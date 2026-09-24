export function pickRandom<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)]
}

// Picks up to `count` distinct random items.
export function pickRandomMany<T>(items: T[], count: number): T[] {
  const pool = [...items]
  const picked: T[] = []
  while (picked.length < count && pool.length > 0) {
    picked.push(...pool.splice(Math.floor(Math.random() * pool.length), 1))
  }
  return picked
}
