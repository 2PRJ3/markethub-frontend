import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnexionView from '../views/ConnexionView.vue'
import SignInView from '@/views/SignInView.vue'
import ProfilView from '@/views/ProfilView.vue'
import { useLoginStore } from '@/stores/loginStore'
import CreateServiceView from '@/views/CreateServiceView.vue'
import CatalogueView from '@/views/CatalogueView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: ConnexionView,
      meta: { guestOnly: true },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
      meta: { guestOnly: true },
    },
    {
      path: '/profiluser',
      name: 'profil-user',
      component: ProfilView,
      meta: { requiresAuth: true },
    },
    {
      path: '/create-service',
      name: 'create-service',
      component: CreateServiceView,
      meta: { requiresAuth: true },
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: CatalogueView,
    },
    {
      path: '/services/:id',
      name: 'service-detail',
      component: () => import('@/views/ServiceDetailView.vue'),
    },
    {
      path: '/services/:id/order',
      name: 'order-brief',
      component: () => import('@/views/OrderBriefView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const loginStore = useLoginStore()

  await loginStore.initAuth()

  if (to.meta.requiresAuth && !loginStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && loginStore.isAuthenticated) {
    return { name: 'profiluser' }
  }
  return true
})
export default router
