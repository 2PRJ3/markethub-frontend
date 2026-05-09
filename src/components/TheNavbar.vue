<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import Menubar from 'primevue/menubar'
import OverlayBadge from 'primevue/overlaybadge'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import type { NavItem } from '@/types/nav.ts'

import avatarImage from '@/assets/pictures/avatar.png'

const isAuthenticated = ref(false)
const isMobile = useMediaQuery('(max-width: 960px)')
console.log(isAuthenticated.value)
const items = computed<NavItem[]>(() => {
  const baseMenu: NavItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Catégories', route: '/' },
    { label: 'Contact', route: '/' },
  ]

  if (isAuthenticated.value) {
    baseMenu.push({ label: 'Mon profil', route: '/', class: 'md:hidden' })
  }
  if (!isAuthenticated.value && isMobile.value) {
    baseMenu.push(
      { separator: true, class: 'border flex items-center justify-center w-3xs' },
      { label: 'Connexion', route: '/', class: 'bg-' },
      { label: "S'inscrire", route: '/' },
    )
  }
  return baseMenu
})
</script>

<template>
  <Menubar
    :model="items"
    class="border-0 border-b border-surface-200 dark:border-surface-700 rounded-none px-6 py-3"
  >
    <template #start>
      <router-link to="/" class="flex items-center mr-8">
        <span class="text-2xl font-bold text-[#2921A3]">Markethub</span>
      </router-link>
    </template>

    <template #buttonicon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-menu-icon lucide-menu"
      >
        <path d="M4 5h16" />
        <path d="M4 12h16" />
        <path d="M4 19h16" />
      </svg>
    </template>
    <template #item="{ item }">
      <router-link v-if="item.route" :to="item.route" v-slot="{ isActive }" custom>
        <a
          :class="[
            'flex items-center justify-center px-3 py-2 transition-colors',
            !isActive
              ? 'text-[#ffff] font-semibold border-b-2 border-[#2921A3]'
              : 'text-surface-700 dark:text-surface-200 hover:text-[#2921A3]',
          ]"
        >
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>

    <template #end>
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-4" aria-label="Panier">
          <OverlayBadge v-if="0 > 0" :value="0" severity="danger">
            <i class="pi pi-shopping-cart text-xl" />
          </OverlayBadge>
          <i v-else class="pi pi-shopping-cart text-xl" />
        </button>

        <div class="hidden md:flex h-6 w-px bg-surface-300 dark:bg-surface-600" />

        <div class="hidden md:flex items-center gap-4" v-if="!isAuthenticated">
          <router-link to="/login">
            <Button type="button" label="Connexion" severity="secondary" />
          </router-link>

          <Button label="S'inscrire" icon="pi pi-user-plus" class="bg-[#2921A3]" />
        </div>

        <div v-else class="hidden md:flex items-center gap-4">
          <Button
            label="Discussions"
            severity="info"
            icon="pi pi-send text-xl"
            class="hidden md:inline-flex md:items-center"
          />
          <router-link to="/">
            <Avatar :image="avatarImage" shape="circle" size="large" class="flex" />
          </router-link>
        </div>
      </div>
    </template>
  </Menubar>
</template>
<style scoped>
@media (max-width: 960px) {
  :deep(.p-menubar-button) {
    order: 99;
    margin-left: auto;
    background: transparent !important;
  }

  :deep(.p-menubar-end) {
    order: 98;
  }

  :deep(.p-menubar-start) {
    order: 1;
    margin-right: auto;
  }

  :deep(.p-menubar-root-list) {
    right: 0;
    left: auto !important;
  }
}
</style>
