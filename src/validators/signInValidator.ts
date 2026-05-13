import type { ValidationError } from '@/types/validation'
import { validatePassword, validateEmail } from '@/validators/authValidation'

export function validateFirstName(firstName: string): ValidationError[] {
  const errors: ValidationError[] = []
  const trimmed = firstName?.trim() ?? ''

  if (!trimmed) {
    errors.push({ field: 'first_name', message: 'Le prénom est requis' })
  } else if (trimmed.length < 2) {
    errors.push({
      field: 'first_name',
      message: 'Le prénom doit contenir au moins 2 caractères.',
    })
  } else if (trimmed.length > 50) {
    errors.push({
      field: 'first_name',
      message: 'Le prénom ne peut pas dépasser 50 caractères.',
    })
  }
  return errors
}

export function validateLastName(lastName: string): ValidationError[] {
  const errors: ValidationError[] = []
  const trimmed = lastName?.trim() ?? ''

  if (!trimmed) {
    errors.push({ field: 'last_name', message: 'Le nom est requis' })
  } else if (trimmed.length < 2) {
    errors.push({
      field: 'last_name',
      message: 'Le nom doit contenir au moins 2 caractères.',
    })
  } else if (trimmed.length > 50) {
    errors.push({
      field: 'last_name',
      message: 'Le nom ne peut pas dépasser 50 caractères.',
    })
  }
  return errors
}

export function validateSignInFields(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): ValidationError[] {
  return [
    ...validateFirstName(firstName),
    ...validateLastName(lastName),
    ...validateEmail(email),
    ...validatePassword(password),
  ]
}
