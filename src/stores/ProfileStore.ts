import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { UserPublic } from '@/types/user'
import type { ServiceSummary } from '@/types/service'

export const useProfileStore = defineStore('userProfileStore', () => {
  const profile = ref<UserPublic | null>(null)
  const profileServices = ref<ServiceSummary[]>([])
  const profileServicesPagination = ref({
    page: 1,
    page_size: 6,
    total: 0,
    total_pages: 0,
  })
  const loading = ref<boolean>(false)

  async function fetchUserProfile(userId: number): Promise<void> {
    try {
      const { data } = await api.get<UserPublic>(`/users/${userId}`)
      profile.value = data
    } catch (error) {
      console.error('Fetch user profile failed:', error)
      profile.value = null
      throw error
    }
  }

  async function fetchUserServices(userId: number, page: number = 1): Promise<void> {
    try {
      const page_size = profileServicesPagination.value.page_size
      const skip = (page - 1) * page_size

      const { data } = await api.get<ServiceSummary[]>(`/services/seller/${userId}`, {
        params: { skip, limit: page_size },
      })

      profileServices.value = data

      const hasNextPage = data.length === page_size
      profileServicesPagination.value = {
        page,
        page_size,
        total: hasNextPage ? page * page_size + 1 : (page - 1) * page_size + data.length,
        total_pages: hasNextPage ? page + 1 : page,
      }
    } catch (error) {
      console.error('Fetch user services failed:', error)
      profileServices.value = []
      throw error
    }
  }

  async function fetchProfilePage(userId: number): Promise<void> {
    loading.value = true
    try {
      await Promise.all([fetchUserProfile(userId), fetchUserServices(userId, 1)])
    } finally {
      loading.value = false
    }
  }

  async function changeServicesPage(userId: number, page: number): Promise<void> {
    loading.value = true
    try {
      await fetchUserServices(userId, page)
    } finally {
      loading.value = false
    }
  }

  function resetProfile(): void {
    profile.value = null
    profileServices.value = []
    profileServicesPagination.value = {
      page: 1,
      page_size: 6,
      total: 0,
      total_pages: 0,
    }
  }

  return {
    profile,
    profileServices,
    profileServicesPagination,
    loading,
    fetchUserProfile,
    fetchUserServices,
    fetchProfilePage,
    changeServicesPage,
    resetProfile,
  }
})
