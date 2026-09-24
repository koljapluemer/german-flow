<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import PracticeCard from './card/PracticeCard.vue'
import TopicForm from './generate/TopicForm.vue'
import { usePracticeQueue } from './queue/usePracticeQueue'

const { loading, needsTopic, candidate, rate, loadNext } = usePracticeQueue()
const topicForm = ref<InstanceType<typeof TopicForm>>()

function openTopicForm(): void {
  topicForm.value?.open()
}

watch(needsTopic, async (needed) => {
  if (!needed) return
  await nextTick()
  openTopicForm()
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8">
    <span
      v-if="loading"
      class="loading loading-spinner loading-lg self-center"
    />
    <PracticeCard
      v-else-if="candidate"
      :candidate="candidate"
      @rate="rate"
    />
    <p
      v-else
      class="text-center text-base-content/70"
    >
      Add a topic to keep practicing.
    </p>
  </div>

  <button
    v-if="!loading"
    type="button"
    class="btn btn-primary btn-circle btn-lg fixed right-5 bottom-5 shadow-lg"
    aria-label="Add topic"
    @click="openTopicForm"
  >
    <Plus :size="26" />
  </button>

  <TopicForm
    ref="topicForm"
    @generated="loadNext"
  />
</template>
