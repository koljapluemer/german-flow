<script setup lang="ts">
import UpdatePrompt from '@/dumb/pwa/UpdatePrompt.vue'
import { useOnline } from '@/dumb/useOnline'

const online = useOnline()

</script>

<template>
  <div >
    <header >
      <router-link
        :to="{ name: 'home' }"
        
      >
        mandarin-flow
      </router-link>

      <nav >
<!-- nav here -->
      </nav>
    </header>

    <main >
      <RouterView />
    </main>

    <UpdatePrompt />
  </div>
</template>
