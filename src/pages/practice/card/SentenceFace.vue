<script setup lang="ts">
import type { SentenceCandidate } from '../queue/resolveCandidate'
import VocabList from './VocabList.vue'

defineProps<{ candidate: SentenceCandidate; revealed: boolean }>()
</script>

<template>
  <p class="text-2xl font-semibold">
    {{ candidate.text }}
  </p>
  <VocabList
    v-if="candidate.showVocabOnFront"
    :vocab="candidate.vocab"
  />
  <template v-if="revealed">
    <div class="divider my-0" />
    <p class="text-xl opacity-70">
      {{ candidate.translation }}
    </p>
    <VocabList
      v-if="!candidate.showVocabOnFront"
      :vocab="candidate.vocab"
    />
  </template>
</template>
