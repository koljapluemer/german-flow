<script setup lang="ts">
import { ref } from 'vue'
import type { Grade } from 'ts-fsrs'
import type { Candidate } from '../queue/resolveCandidate'
import RatingButtons from './RatingButtons.vue'
import SentenceFace from './SentenceFace.vue'
import VocabFace from './VocabFace.vue'

defineProps<{ candidate: Candidate }>()
const emit = defineEmits<{ rate: [rating: Grade] }>()

const revealed = ref(false)
</script>

<template>
  <div class="card w-full shadow-xl">
    <div class="card-body items-center gap-4 text-center">
      <span class="badge badge-primary badge-outline">What does this mean?</span>
      <VocabFace
        v-if="candidate.kind === 'vocab'"
        :candidate="candidate"
        :revealed="revealed"
      />
      <SentenceFace
        v-else
        :candidate="candidate"
        :revealed="revealed"
      />
      <RatingButtons
        v-if="revealed"
        @rate="emit('rate', $event)"
      />
      <button
        v-else
        type="button"
        class="btn"
        @click="revealed = true"
      >
        Show answer
      </button>
    </div>
  </div>
</template>
