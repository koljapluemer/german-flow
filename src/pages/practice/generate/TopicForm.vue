<script setup lang="ts">
import { ref } from 'vue'
import { generatePhrases } from './generatePhrases'

const emit = defineEmits<{ generated: [] }>()

const topic = ref('')
const generating = ref(false)
const error = ref('')

async function submit(): Promise<void> {
  generating.value = true
  error.value = ''
  try {
    await generatePhrases(topic.value.trim())
    emit('generated')
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : String(caught)
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="submit"
  >
    <p>Nothing due. What do you want to practice next?</p>
    <fieldset class="fieldset">
      <label
        class="fieldset-legend"
        for="topic"
      >Topic or situation</label>
      <input
        id="topic"
        v-model="topic"
        class="input w-full"
        placeholder="e.g. ordering at a bakery"
        required
        :disabled="generating"
      >
    </fieldset>
    <div
      v-if="error"
      role="alert"
      class="alert alert-error"
    >
      {{ error }}
    </div>
    <button
      type="submit"
      class="btn btn-primary"
      :disabled="generating || !topic.trim()"
    >
      <span
        v-if="generating"
        class="loading loading-spinner"
      />
      Generate
    </button>
  </form>
</template>
