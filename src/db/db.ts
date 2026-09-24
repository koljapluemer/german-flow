import Dexie, { type EntityTable } from 'dexie'
import type { Card } from 'ts-fsrs'

export type SentenceRow = { id: string; translation: string; vocabIds: string[]; topic: string; createdAt: Date }
export type VocabRow = { id: string; translation: string }
export type SentenceCardRow = Card & { id: string; lastAnswerCorrect: boolean }
export type VocabCardRow = Card & { id: string; level: 1 | 2 | 3 | 4; initialSentence: string }

export const db = new Dexie('germanFlow') as Dexie & {
  sentences: EntityTable<SentenceRow, 'id'>
  vocab: EntityTable<VocabRow, 'id'>
  sentenceCards: EntityTable<SentenceCardRow, 'id'>
  vocabCards: EntityTable<VocabCardRow, 'id'>
}

db.version(1).stores({
  sentences: 'id, createdAt',
  vocab: 'id',
  sentenceCards: 'id',
  vocabCards: 'id'
})
