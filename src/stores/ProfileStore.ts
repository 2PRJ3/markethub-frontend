import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { UserPublic } from '@/types/user'
import type { ServiceSummary } from '@/types/service'

export const useProfileStore = defineStore('profilStore', () => {
  const profile = ref<UserPublic | null>(null)
  const profileServices = ref<ServiceSummary[]>([])
  const loading = ref<boolean>(true)
  async function fetchUserProfile(userId: number): Promise<void> {
    try {
      const { data } = await api.get<UserPublic>(`users/${userId}`)
      profile.value = data
    } catch (error) {
      console.error('Erreur lors de la récupération ', error)
      profile.value = null
      throw error
    }
  }

  async function fetchUserServices(userId: number): Promise<void> {
    loading.value = true
    try {
      const { data } = await api.get<ServiceSummary[]>(`seller/${userId}`)
      profileServices.value = data
    } catch (error) {
      console.log('Erreur lors de la récupération ', error)
      profileServices.value = []
      throw error
    }
  }

  async function fetchProfilePage(userId: number): Promise<void> {
    loading.value = true
    try {
      await Promise.all([fetchUserProfile(userId), fetchUserServices(userId)])
    } finally {
      loading.value = false
    }
  }
  function resetProfile(): void {
    profile.value = null
    profileServices.value = []
  }

  return {
    profile,
    profileServices,
    loading,
    fetchUserServices,
    fetchUserProfile,
    fetchProfilePage,
    resetProfile,
  }
})
