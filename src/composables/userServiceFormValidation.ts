import type { ServiceDraft, StepKey, StepValidation } from '@/types/service'
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export function validateStep(step: StepKey, draft: ServiceDraft): StepValidation {
  const errors: Record<string, string> = {}

  if (step === 1) {
    const title = draft.title.trim()

    if (!title) {
      errors.title = 'Le titre est requis'
    } else if (title.length < 5) {
      errors.title = 'Au moins 5 caractères'
    } else if (title.length > 100) {
      errors.title = 'Maximum 100 caractères'
    }

    if (draft.category_id === null) {
      errors.category_id = 'Chosis une catégorie'
    }
  }

  if (draft.price === null || draft.price === undefined) {
    errors.price = 'Le prix est requis'
  } else if (draft.price <= 0) {
    errors.price = 'Le prix doit être positif'
  } else if (draft.price > 10000) {
    errors.price = 'Prix maximum : 10000 €'
  }

  if (step === 2) {
    const description = draft.description.trim()
    if (!description) {
      errors.description = 'La description est requise'
    } else if (description.length < 20) {
      errors.description = 'Au moins 20 caractères'
    } else if (description.length > 2000) {
      errors.description = 'Maximum 2000 caractères'
    }

    if (draft.image_file) {
      if (!ALLOWED_IMAGE_TYPES.includes(draft.image_file.type)) {
        errors.image_file = 'Format accepté : JPEG, PNG, WebP'
      } else if (draft.image_file.size > 5 * 1024 * 1024) {
        errors.image_file = 'Image trop lourde (max 5 Mo) '
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
