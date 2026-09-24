export type ExampleRequest = { lemma: string; count: number }

type GeneratedExample = { text: string; translation: string }

export type GeneratedVocabExamples = {
  vocab: { lemma: string; examples: GeneratedExample[] }[]
}

export function buildExamplePrompt(topic: string, requests: ExampleRequest[], existingSentences: string[]): string {
  const requestedExamples = requests.map(({ lemma, count }) => `- ${lemma}: ${count}`).join('\n')

  return [
    `Write the requested number of short, natural German example sentences for each vocabulary item below, in the context of: "${topic}".`,
    'Each sentence must demonstrate the listed vocabulary item in a normal inflected form and have an accurate English translation.',
    'Return one vocab entry for every listed lemma. Do not return unrequested vocabulary entries.',
    `Do not repeat any of these existing sentences: ${JSON.stringify(existingSentences)}.`,
    requestedExamples
  ].join('\n')
}

export const exampleSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['vocab'],
  properties: {
    vocab: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['lemma', 'examples'],
        properties: {
          lemma: { type: 'string' },
          examples: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['text', 'translation'],
              properties: {
                text: { type: 'string' },
                translation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}
