import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'
import type { User, TokenResponse } from '@/types/auth'

export const useLoginStore = defineStore('loginStore', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)

  const isAuthenticated = computed(() => !!user.value)

  let initPromise: Promise<void> | null = null

  async function handleLogin(email: string, password: string): Promise<void> {
    loading.value = true
    try {
      await api.post('/auth/login', { email, password })
      await fetchUserProfile()
    } catch (error) {
      user.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserProfile(): Promise<void> {
    try {
      const { data } = await api.get<User>('/auth/me')
      user.value = data
    } catch (error) {
      console.error('Login failed:', error)
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  async function initAuth(): Promise<void> {
    if (isInitialized.value) return
    if (initPromise) return initPromise

    initPromise = fetchUserProfile().finally(() => {
      initPromise = null
    })
    return initPromise
  }

  async function logout(): Promise<void> {
    try {
      await api.post<TokenResponse>('/auth/logout')
    } finally {
      user.value = null
      isInitialized.value = false
    }
  }
  return {
    user,
    loading,
    isInitialized,
    isAuthenticated,
    handleLogin,
    fetchUserProfile,
    initAuth,
    logout,
  }
})
