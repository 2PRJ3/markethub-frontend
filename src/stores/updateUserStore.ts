import { defineStore} from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import { useLoginStore} from '@/stores/loginStore.ts'
import type { User, UserUpdatePayload, PasswordUpdatePayload } from '@/types/auth'

export const useUpdateUserStore = defineStore('updateUserStore', () => {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)


  async function updateProfile(payload: UserUpdatePayload): Promise<User | null> {
    if (Object.keys(payload).length === 0) {
      return useLoginStore().user
    }

    loading.value = true
    error.value = null

    try {
      const { data } = await api.patch<User>('/users/me', payload)

      const loginStore = await useLoginStore()
      loginStore.user = data
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.detail || 'La mise à jour a échoué'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAvatar(avatarUrl: string): Promise<User | null> {
    return updateProfile({avatar_url: avatarUrl})
  }

  async function updatePassword(payload: PasswordUpdatePayload): Promise<void> {

    if (!payload.current_password || !payload.new_password) {
      throw new Error('Votre mot de passe actuel et nouveau mot de passe sont requis')
    }

    if (payload.current_password === payload.new_password) {
      error.value = 'Votre nouveau mot de passe doit être différent de l\'ancien'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = null

    try {
      await api.post(`/users/me/change-password`, payload)
    } catch(err: any) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        error.value = "Mot de passe actuel incorrect"
      }else {
        error.value = err?.response?.data?.detail ||"Le changement de mot de passe a échoué"
      }
      throw err
    }finally {
      loading.value = false
    }
  }

  function cleanError() {
    error.value = null
  }

  return {
    loading,
    error,
    updateProfile,
    updateAvatar,
    updatePassword,
    cleanError,
  }
})
