import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { UserCreate } from '@/types/auth.ts'
import { SignInValidationError, type ValidationError } from '@/types/validation'
import { validateSignInFields} from '@/validators/signInValidator'

export const useSignInStore = defineStore('signInStore', () => {
  const user = ref<UserCreate | null>(null)
  const loading = ref(false)
  const errors = ref<ValidationError[]>([])

  async function handleSignIn(first_name: string, last_name: string, email: string, password: string): Promise<void> {
    loading.value = true
    errors.value = []

    const validationErrors =  validateSignInFields(first_name, last_name, email, password)
    if (validationErrors.length > 0) {
      errors.value = validationErrors
      loading.value = false
      throw new SignInValidationError(validationErrors)
    }

    const dataUser = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }
    try {
      const { data } = await api.post<UserCreate>('/users', dataUser)
      user.value = data
    }catch (error) {
      user.value = null

      const detail = error?.response?.data?.detail

      if (Array.isArray(detail)) {
        errors.value = detail.map((d) => ({
          field: Array.isArray(d.loc) ? String(d.loc[d.loc.length - 1]) : 'global',
          message: d.msg ?? "Erreur de validation",
        }))
      } else if (typeof detail === 'string') {
        errors.value = [{field: 'global', message: detail}]
      } else {
        errors.value = [
          { field: 'global', message: 'Une erreur est survenue. Veuillez réessayer.' },
        ]
      }
      throw error
    }finally {
      loading.value = false
    }

  }
  function clearErrors() {
    errors.value = []
  }

  function getErrorForField(field: string): string | undefined {
    return errors.value.find((e) => e.field === field)?.message
  }
  return {
    user,
    loading,
    errors,
    handleSignIn,
    clearErrors,
    getErrorForField,
  }
})
