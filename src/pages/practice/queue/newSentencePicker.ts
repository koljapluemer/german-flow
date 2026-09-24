import type { SentenceCardRow, SentenceRow, VocabCardRow } from '@/db/db'
import { pickRandom } from '@/dumb/pickRandom'

// Picks an unseen sentence, preferring the most overlap with vocab already
// being learned. Ties are broken randomly.
export function pickNewSentence(
  sentences: Map<string, SentenceRow>,
  sentenceCards: Map<string, SentenceCardRow>,
  vocabCards: Map<string, VocabCardRow>
): SentenceRow | undefined {
  const scored = [...sentences.values()]
    .filter((sentence) => !sentenceCards.has(sentence.id))
    .map((sentence) => ({ sentence, score: sentence.vocabIds.filter((id) => vocabCards.has(id)).length }))
  const bestScore = Math.max(...scored.map((entry) => entry.score))
  return pickRandom(scored.filter((entry) => entry.score === bestScore))?.sentence
}
