import { db, type VocabRow } from '../../db/db'

export async function getVocab(): Promise<Map<string, VocabRow>> {
  const rows = await db.vocab.toArray()
  return new Map(rows.map((row) => [row.id, row]))
}

// Existing entries keep their translation, so cards don't change meaning
// when a later generation phrases it differently. Within one batch, the
// first occurrence of a word wins.
export async function addVocab(rows: VocabRow[]): Promise<void> {
  const unique = [...new Map([...rows].reverse().map((row) => [row.id, row])).values()]
  await db.transaction('rw', db.vocab, async () => {
    const existing = await db.vocab.bulkGet(unique.map((row) => row.id))
    await db.vocab.bulkAdd(unique.filter((_, index) => !existing[index]))
  })
}
