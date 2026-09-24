# Practice

The app is a single practice page (`src/pages/practice/`): an endless spaced-repetition flow over German sentences and their vocab. All content is generated via OpenAI and stored per user in Dexie.

## Setup

`.env` needs `VITE_OPENAI_API_KEY`. It is read in the browser and ends up in the client bundle.

## Data (`src/db/db.ts`)

| Table           | Key                 | Content                                                  |
| --------------- | ------------------- | -------------------------------------------------------- |
| `sentences`     | German text         | `translation`, `vocabIds`, `topic`, `createdAt`          |
| `vocab`         | lemma ("der Tisch") | `translation`                                            |
| `sentenceCards` | sentence id         | FSRS card + `lastAnswerCorrect`                          |
| `vocabCards`    | vocab id            | FSRS card + `level` (1–4) + `initialSentence`            |

Content (`sentences`, `vocab`) and progress (`*Cards`) are separate. A sentence or vocab item without a card has not been seen yet.

## Flow (`queue/`)

Each step, `usePracticeQueue` picks one item:

1. Build the due pool (`duePool.ts`), excluding the item shown last (never show the same item back-to-back):
   - vocab level 1–3: always due
   - vocab level 4: due when FSRS says so
   - sentence, last answer wrong: due when FSRS says so
   - sentence, last answer correct: due when FSRS says so **and** all its vocab is level 4 and not due
2. Pool empty → introduce an unseen stored sentence (`newSentencePicker.ts`), preferring the most overlap with vocab already being learned. This creates its sentence card and cards for any new vocab (`initialSentence` = this sentence).
3. No unseen sentences left → show the topic form (`generate/`).

## Cards (`resolveCandidate.ts`, `card/`)

Example sentences for vocab are other stored sentences containing that vocab.

| Item                   | Front                                                  | Back                                   |
| ---------------------- | ------------------------------------------------------ | -------------------------------------- |
| vocab level 1          | word, initial sentence + 2 examples, with translations | translation                            |
| vocab level 2          | word, 3 examples (not initial), with translations      | translation                            |
| vocab level 3          | word, 3 examples, without translations                 | translation                            |
| vocab level 4          | word                                                   | translation, 3 examples                |
| sentence, last wrong   | sentence, vocab list                                   | translation                            |
| sentence, last correct | sentence                                               | translation, vocab list                |

## Rating

Standard FSRS grades (Again / Hard / Good / Easy), plus:

- vocab: Good/Easy → level +1, Again → level −1 (clamped to 1–4)
- sentence: `lastAnswerCorrect` = Good/Easy
- sentence previously correct, now Again/Hard → due date of all its vocab set to now (no FSRS review simulated)

## Generation (`generate/`)

`phrasePrompt.ts` holds model, phrase count, prompt and JSON schema (OpenAI structured outputs, strict). `generatePhrases.ts` saves the result: vocab first (existing entries keep their translation, duplicates within a batch are collapsed), then sentences.
