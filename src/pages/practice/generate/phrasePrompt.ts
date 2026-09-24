const PHRASE_COUNT = 5

export type GeneratedPhrase = {
  text: string
  translation: string
  vocab: { lemma: string; translation: string }[]
}

export type GeneratedPhrases = { phrases: GeneratedPhrase[] }

export function buildPhrasePrompt(topic: string): string {
  return [
    `Generate ${PHRASE_COUNT} short, natural German phrases a learner would use in this topic or situation: "${topic}".`,
    'For each phrase, give an English translation and list every content word and important function word as vocab.',
    'Vocab lemma: dictionary form; nouns with their article (e.g. "der Tisch"), verbs in the infinitive.',
    'Vocab translation: short English meaning as used in the phrase.',
    'Reuse the same vocab across several phrases where natural.'
  ].join('\n')
}

export const phraseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['phrases'],
  properties: {
    phrases: {
      type: 'array',
      maxItems: PHRASE_COUNT,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'translation', 'vocab'],
        properties: {
          text: { type: 'string' },
          translation: { type: 'string' },
          vocab: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['lemma', 'translation'],
              properties: {
                lemma: { type: 'string' },
                translation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}
