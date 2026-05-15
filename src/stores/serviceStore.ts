import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import api from '@/api/axios'
import { validateStep } from '@/composables/userServiceFormValidation.ts'

import type {
  ServiceRead,
  ServiceDraft,
  StepKey,
  ServiceCreatePayload,
  ServiceListParams,
  ServiceSummary,
} from '@/types/service'
interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  format: string
  bytes: number
}
const emptyDraft = (): ServiceDraft => ({
  title: '',
  category_id: null,
  price: null,
  description: '',
  image_file: null,
  image_preview: null,
})

export const useServiceStore = defineStore('serviceStore', () => {
  const draft = ref<ServiceDraft>(emptyDraft())
  const currentStep = ref<StepKey>(1)
  const stepErrors = ref<Record<string, string>>({})

  const services = ref<ServiceSummary[]>([])
  const currentService = ref<ServiceRead | null>(null)
  const pagination = ref({ page: 1, page_size: 12, total: 0, total_pages: 0 })

  const loading = ref<boolean>(false)

  const canGoNext = computed(() => {
    const { valid } = validateStep(currentStep.value, draft.value)
    return valid
  })

  function validateCurrentStep(): boolean {
    const { valid, errors } = validateStep(currentStep.value, draft.value)
    stepErrors.value = errors
    return valid
  }

  function goToNextStep(): boolean {
    if (!validateCurrentStep()) return false
    if (currentStep.value < 3) {
      currentStep.value = (currentStep.value + 1) as StepKey
      stepErrors.value = {}
    }
    return true
  }

  function goToPreviousStep(): void {
    if (currentStep.value > 1) {
      currentStep.value = (currentStep.value - 1) as StepKey
      stepErrors.value = {}
    }
  }

  function setImage(file: File | null): void {
    if (draft.value.image_preview) {
      URL.revokeObjectURL(draft.value.image_preview)
    }
    draft.value.image_file = file
    draft.value.image_preview = file ? URL.createObjectURL(file) : null
  }

  function resetDraft(): void {
    if (draft.value.image_preview) {
      URL.revokeObjectURL(draft.value.image_preview)
    }
    draft.value = emptyDraft()
    currentStep.value = 1
    stepErrors.value = {}
  }

  async function uploadImageToCloudinary(file: File): Promise<string> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !preset) {
      throw new Error('Configuration Cloudinary manquante (.env)')
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)

    const { data } = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data.secure_url
  }

  async function createService(): Promise<ServiceRead | null> {
    for (const s of [1, 2] as StepKey[]) {
      const { valid, errors } = validateStep(s, draft.value)
      if (!valid) {
        currentStep.value = s
        stepErrors.value = errors
        return null
      }
    }
    loading.value = true
    try {
      let imageUrl: string | null = null
      if (draft.value.image_file) {
        imageUrl = await uploadImageToCloudinary(draft.value.image_file)
      }

      const payload: ServiceCreatePayload = {
        title: draft.value.title.trim(),
        category_id: draft.value.category_id!,
        price: draft.value.price!,
        description: draft.value.description.trim(),
        image_url: imageUrl,
      }

      const { data } = await api.post<ServiceRead>('/services', payload)
      resetDraft()
      return data
    } catch (error) {
      console.error('Publish service failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  async function fetchServices(params: ServiceListParams = {}): Promise<void> {
    loading.value = true
    try {
      const skip =
        ((params.page ?? pagination.value.page) - 1) *
        (params.page_size ?? pagination.value.page_size)
      const limit = params.page_size ?? pagination.value.page_size

      const { data } = await api.get<ServiceSummary[]>('/services', {
        params: { skip, limit },
      })

      services.value = data
      pagination.value = {
        page: params.page ?? pagination.value.page,
        page_size: limit,
        total: data.length,
        total_pages: 1,
      }
    } catch (error) {
      console.error('Fetch services failed:', error)
      services.value = []
      throw error
    } finally {
      loading.value = false
    }
  }
  return {
    draft,
    services,
    currentStep,
    stepErrors,
    currentService,
    loading,
    canGoNext,
    validateCurrentStep,
    goToNextStep,
    goToPreviousStep,
    setImage,
    resetDraft,
    createService,
    fetchServices,
  }
})
