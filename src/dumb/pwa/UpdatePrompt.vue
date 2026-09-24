<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RefreshCw } from 'lucide-vue-next'

const { needRefresh, updateServiceWorker } = useRegisterSW()

function reload() {
  updateServiceWorker(true)
}
</script>

<template>
  <div
    v-if="needRefresh"
    class="toast"
  >
    <div class="alert">
      <span>A new version is available.</span>
      <button
        type="button"
        class="btn btn-sm btn-outline"
        @click="reload"
      >
        <RefreshCw
          :size="14"
          aria-hidden="true"
        />
        Reload
      </button>
    </div>
  </div>
</template>
