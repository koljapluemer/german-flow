<script setup lang="ts">
import PracticeCard from './card/PracticeCard.vue'
import TopicForm from './generate/TopicForm.vue'
import { usePracticeQueue } from './queue/usePracticeQueue'

const { loading, needsTopic, candidate, rate, loadNext } = usePracticeQueue()
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8">
    <span
      v-if="loading"
      class="loading loading-spinner loading-lg self-center"
    />
    <TopicForm
      v-else-if="needsTopic"
      @generated="loadNext"
    />
    <PracticeCard
      v-else-if="candidate"
      :candidate="candidate"
      @rate="rate"
    />
  </div>
</template>
