<script setup lang="ts">
import UpdatePrompt from '@/dumb/pwa/UpdatePrompt.vue'
</script>

<template>
  <header class="navbar border-b border-base-300 px-4">
    <router-link
      :to="{ name: 'practice' }"
      class="text-lg font-semibold"
    >
      german-flow
    </router-link>
  </header>

  <main class="flex-1">
    <RouterView />
  </main>

  <UpdatePrompt />
</template>
