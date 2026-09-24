import { createEmptyCard, fsrs, Rating, type Grade } from 'ts-fsrs'
import { db, type SentenceCardRow } from '../../db/db'

const scheduler = fsrs()

export async function getSentenceCards(): Promise<Map<string, SentenceCardRow>> {
  const rows = await db.sentenceCards.toArray()
  return new Map(rows.map((row) => [row.id, row]))
}

export async function createSentenceCard(id: string, now = new Date()): Promise<void> {
  await db.sentenceCards.put({ ...createEmptyCard(now), id, lastAnswerCorrect: false })
}

export async function rateSentenceCard(existing: SentenceCardRow, rating: Grade): Promise<void> {
  const { card } = scheduler.next(existing, new Date(), rating)
  const lastAnswerCorrect = rating === Rating.Good || rating === Rating.Easy
  await db.sentenceCards.put({ ...card, id: existing.id, lastAnswerCorrect })
}
