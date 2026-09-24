import { createEmptyCard, fsrs, Rating, type Grade } from 'ts-fsrs'
import { db, type VocabCardRow } from '../../db/db'

const scheduler = fsrs()

export async function getVocabCards(): Promise<Map<string, VocabCardRow>> {
  const rows = await db.vocabCards.toArray()
  return new Map(rows.map((row) => [row.id, row]))
}

export async function createVocabCard(id: string, initialSentence: string, now = new Date()): Promise<void> {
  await db.vocabCards.put({ ...createEmptyCard(now), id, level: 1, initialSentence })
}

function nextLevel(level: VocabCardRow['level'], rating: Grade): VocabCardRow['level'] {
  if (rating === Rating.Easy || rating === Rating.Good) return Math.min(4, level + 1) as VocabCardRow['level']
  if (rating === Rating.Again) return Math.max(1, level - 1) as VocabCardRow['level']
  return level
}

export async function rateVocabCard(existing: VocabCardRow, rating: Grade): Promise<void> {
  const { card } = scheduler.next(existing, new Date(), rating)
  await db.vocabCards.put({
    ...card,
    id: existing.id,
    level: nextLevel(existing.level, rating),
    initialSentence: existing.initialSentence
  })
}

// Overwrites due dates without simulating an FSRS review, so vocab of a
// sentence that was just failed after being known gets refreshed soon.
export async function setVocabCardsDueNow(ids: string[], now = new Date()): Promise<void> {
  await db.vocabCards.where('id').anyOf(ids).modify({ due: now })
}
