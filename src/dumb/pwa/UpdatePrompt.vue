<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RefreshCw } from 'lucide-vue-next'
import OutlineButton from '../OutlineButton.vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()

function reload() {
  updateServiceWorker(true)
}
</script>

<template>
  <div v-if="needRefresh">
    <div>
      <span>A new version is available.</span>
      <OutlineButton @click="reload">
        <RefreshCw :size="14" aria-hidden="true" />
        Reload
      </OutlineButton>
    </div>
  </div>
</template>
