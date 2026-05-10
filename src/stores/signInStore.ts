import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'
import type { UserCreate } from '@/types/auth.ts'

export const useSignInStore = defineStore('signInStore', () => {
  const user = ref<UserCreate | null>(null)
  const loading = ref(false)

  async function handleSignIn(first_name: string, last_name: string, email: string, password: string): Promise<void> {
    loading.value = true

    try {
      const params = new URLSearchParams()
      params.append('first_name', first_name)
      params.append('last_name', last_name)
      params.append('email', email)
      params.append('password', password)

      const { data } = await api.post('/users', {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
      })
    }catch (error) {
      user.value = null
    }finally {
      loading.value = false
    }

  }

  return {
    user,
    loading,
    handleSignIn,
  }
})
