<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { generatePhrases } from './generatePhrases'

const emit = defineEmits<{ generated: [] }>()

const dialog = ref<HTMLDialogElement>()
const topic = ref('')
const generating = ref(false)
const error = ref('')

function open(): void {
  error.value = ''
  dialog.value?.showModal()
}

function close(): void {
  if (!generating.value) dialog.value?.close()
}

async function submit(): Promise<void> {
  generating.value = true
  error.value = ''
  try {
    await generatePhrases(topic.value.trim())
    topic.value = ''
    dialog.value?.close()
    emit('generated')
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : String(caught)
  } finally {
    generating.value = false
  }
}

defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    @cancel="generating && $event.preventDefault()"
  >
    <div class="modal-box">
      <button
        type="button"
        class="btn btn-circle btn-ghost btn-sm absolute top-3 right-3"
        aria-label="Close"
        :disabled="generating"
        @click="close"
      >
        <X :size="18" />
      </button>
      <form
        class="flex flex-col gap-4"
        @submit.prevent="submit"
      >
        <h2 class="text-xl font-semibold">
          Add a topic
        </h2>
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
            autofocus
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
        <div class="modal-action mt-0">
          <button
            type="button"
            class="btn"
            :disabled="generating"
            @click="close"
          >
            Cancel
          </button>
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
        </div>
      </form>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
    >
      <button :disabled="generating">
        Close
      </button>
    </form>
  </dialog>
</template>
