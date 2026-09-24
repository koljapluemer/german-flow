import { openAiJson } from '@/dumb/openAiJson'
import { addSentences } from '@/entities/sentence/sentence'
import { addVocab } from '@/entities/vocab/vocab'
import { buildPhrasePrompt, PHRASE_MODEL, phraseSchema, type GeneratedPhrases } from './phrasePrompt'

export async function generatePhrases(topic: string): Promise<void> {
  const { phrases } = await openAiJson<GeneratedPhrases>(PHRASE_MODEL, buildPhrasePrompt(topic), 'phrases', phraseSchema)
  const createdAt = new Date()

  await addVocab(phrases.flatMap((phrase) => phrase.vocab.map(({ lemma, translation }) => ({ id: lemma, translation }))))
  await addSentences(
    phrases.map((phrase) => ({
      id: phrase.text,
      translation: phrase.translation,
      vocabIds: [...new Set(phrase.vocab.map((entry) => entry.lemma))],
      topic,
      createdAt
    }))
  )
}
