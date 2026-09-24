import { db, type SentenceRow } from '../../db/db'

export async function getSentences(): Promise<Map<string, SentenceRow>> {
  const rows = await db.sentences.toArray()
  return new Map(rows.map((row) => [row.id, row]))
}

export async function addSentences(rows: SentenceRow[]): Promise<void> {
  await db.sentences.bulkPut(rows)
}
