<script setup lang="ts">
import type { VocabCandidate } from '../queue/resolveCandidate'
import ExampleList from './ExampleList.vue'

defineProps<{ candidate: VocabCandidate; revealed: boolean }>()
</script>

<template>
  <p class="text-3xl font-semibold">
    {{ candidate.word }}
  </p>
  <ExampleList
    :examples="candidate.frontExamples"
    :show-translations="candidate.frontShowTranslations"
  />
  <template v-if="revealed">
    <div class="divider my-0" />
    <p class="text-xl opacity-70">
      {{ candidate.translation }}
    </p>
    <ExampleList
      :examples="candidate.backExamples"
      :show-translations="true"
    />
  </template>
</template>
