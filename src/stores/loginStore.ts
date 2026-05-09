import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'
import type { User, TokenResponse} from '@/types/auth'


export const useLoginStore = defineStore('loginStore', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)

  const isAuthenticated = computed(() => !!user.value)

  async function handleLogin(email: string, password: string): Promise<void> {
    loading.value = true
    try {
      const params = new URLSearchParams()
      params.append('email', email)
      params.append('password', password)

      const { data} = await api.post<TokenResponse>('/auth/login', params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })

      await fetchUserProfile()

    } catch (error) {
      user.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserProfile(): Promise<void> {
    try{
      const { data} = await api.get<User>('/auth/me')
      user.value = data
    } catch (error) {
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  return {
    user,
    loading,
    isInitialized,
    isAuthenticated,
    handleLogin,
    fetchUserProfile,
  }
})
