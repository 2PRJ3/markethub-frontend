<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'
import { useProfileStore } from '@/stores/ProfileStore.ts'
import { useLoginStore } from '@/stores/loginStore'
import TheUserProfileHeader from '@/components/TheUserProfileHeader.vue'
import TheUserProfileTabs from '@/components/TheUserProfileTabs.vue'
import TheNavbar from '@/components/TheNavbar.vue'

const route = useRoute()
const userProfileStore = useProfileStore()
const loginStore = useLoginStore()

const { profile, profileServices, profileServicesPagination, loading } =
  storeToRefs(userProfileStore)

const isOwnProfile = computed(() => {
  if (!loginStore.user || !profile.value) return false
  return loginStore.user.id === profile.value.id
})

async function loadProfile(userId: number): Promise<void> {
  try {
    await userProfileStore.fetchProfilePage(userId)
  } catch (error) {
    console.error('Failed to load profile page:', error)
  }
}

async function onServicesPageChange(page: number): Promise<void> {
  const userId = Number(route.params.userId)
  if (Number.isFinite(userId)) {
    await userProfileStore.changeServicesPage(userId, page)
  }
}

onMounted(() => {
  const userId = Number(route.params.userId)
  if (Number.isFinite(userId)) {
    loadProfile(userId)
  }
})

watch(
  () => route.params.userId,
  (newUserId) => {
    const userId = Number(newUserId)
    if (Number.isFinite(userId)) {
      userProfileStore.resetProfile()
      loadProfile(userId)
    }
  },
)

onUnmounted(() => {
  userProfileStore.resetProfile()
})
</script>

<template>
  <header>
    <TheNavbar />
  </header>
  <div class="max-w-7xl mx-auto">
    <div v-if="loading" class="space-y-6">
      <Skeleton height="12rem" class="rounded-none" />
      <div class="px-6 space-y-4">
        <Skeleton height="2rem" width="20rem" />
        <Skeleton height="1rem" width="30rem" />
      </div>
    </div>

    <div v-else-if="!profile" class="px-6 py-12">
      <Message severity="warn" :closable="false"> Utilisateur introuvable. </Message>
    </div>

    <template v-else>
      <TheUserProfileHeader :user="profile" :hide-contact-button="isOwnProfile" />
      <TheUserProfileTabs
        :user="profile"
        :services="profileServices"
        :pagination="profileServicesPagination"
        @page-change="onServicesPageChange"
      />
    </template>
  </div>
</template>
