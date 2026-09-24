import { openAiJson } from '@/dumb/openAiJson'
import { addSentences } from '@/entities/sentence/sentence'
import { addVocab } from '@/entities/vocab/vocab'
import { buildExamplePrompt, exampleSchema, type ExampleRequest, type GeneratedVocabExamples } from './examplePrompt'
import { buildPhrasePrompt, phraseSchema, type GeneratedPhrases } from './phrasePrompt'

const MIN_EXAMPLES = 2

function getMissingExamples(phrases: GeneratedPhrases['phrases']): ExampleRequest[] {
  const counts = new Map<string, number>()

  for (const phrase of phrases) {
    for (const lemma of new Set(phrase.vocab.map((entry) => entry.lemma))) {
      counts.set(lemma, (counts.get(lemma) ?? 0) + 1)
    }
  }

  return [...counts].flatMap(([lemma, count]) =>
    count < MIN_EXAMPLES ? [{ lemma, count: MIN_EXAMPLES - count }] : []
  )
}

async function generateMissingExamples(topic: string, phrases: GeneratedPhrases['phrases'], requests: ExampleRequest[]) {
  if (requests.length === 0) return []

  const existingSentences = new Set(phrases.map(({ text }) => text))
  const result = await openAiJson<GeneratedVocabExamples>(
    buildExamplePrompt(topic, requests, [...existingSentences]),
    'vocab_examples',
    exampleSchema
  )
  const requestedCounts = new Map(requests.map(({ lemma, count }) => [lemma, count]))
  const examplesByLemma = new Map(result.vocab.map(({ lemma, examples }) => [lemma, examples]))

  return requests.flatMap(({ lemma }) => {
    const count = requestedCounts.get(lemma) ?? 0
    const examples = [...new Map(examplesByLemma.get(lemma)?.map((example) => [example.text, example])).values()]
      .filter(({ text }) => !existingSentences.has(text))
      .slice(0, count)
    if (examples.length < count) throw new Error(`OpenAI returned too few examples for "${lemma}"`)
    return examples.map((example) => ({ ...example, vocabIds: [lemma] }))
  })
}

function mergeSentences(sentences: { id: string; translation: string; vocabIds: string[] }[]) {
  const merged = new Map<string, (typeof sentences)[number]>()

  for (const sentence of sentences) {
    const existing = merged.get(sentence.id)
    merged.set(sentence.id, {
      ...sentence,
      vocabIds: [...new Set([...(existing?.vocabIds ?? []), ...sentence.vocabIds])]
    })
  }

  return [...merged.values()]
}

export async function generatePhrases(topic: string): Promise<void> {
  const { phrases } = await openAiJson<GeneratedPhrases>(buildPhrasePrompt(topic), 'phrases', phraseSchema)
  const createdAt = new Date()
  const examples = await generateMissingExamples(topic, phrases, getMissingExamples(phrases))

  await addVocab(phrases.flatMap((phrase) => phrase.vocab.map(({ lemma, translation }) => ({ id: lemma, translation }))))
  await addSentences(
    mergeSentences([
      ...phrases.map((phrase) => ({
        id: phrase.text,
        translation: phrase.translation,
        vocabIds: [...new Set(phrase.vocab.map((entry) => entry.lemma))]
      })),
      ...examples.map(({ text: id, translation, vocabIds }) => ({ id, translation, vocabIds }))
    ]).map((sentence) => ({ ...sentence, topic, createdAt }))
  )
}
