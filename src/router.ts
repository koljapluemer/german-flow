import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'practice', component: () => import('./pages/practice/PagePractice.vue') }]
})

export default router
