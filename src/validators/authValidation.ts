import type { ValidationError } from '@/types/validation'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const ALLOWED_SPECIAL_CHARS = '@$!%*?&'
export function validateEmail(email: string): ValidationError[] {
  const errors: ValidationError[] = []
  const trimmed = email?.trim().toLowerCase() ?? ''

  if (!trimmed) {
    errors.push({ field: 'email', message: "L'email est requis" })
  } else if (trimmed.length > 254) {
    errors.push({
      field: 'email',
      message: "L'email que vous avez rentré dépasse la limite maximale du nombre de caractères",
    })
  } else if (!EMAIL_REGEX.test(trimmed)) {
    errors.push({ field: 'email', message: "L'email n'est pas valide" })
  }
  return errors
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!password) {
    errors.push({ field: 'password', message: 'Le mot de passe est requis' })
    return errors
  }

  if (password.length > 128) {
    errors.push({
      field: 'password',
      message:
        'Le mot de passe que vous avez rentré dépasse la limite maximale du nombre de caractères',
    })
    return errors
  }

  if (!PASSWORD_REGEX.test(password)) {
    if (password.length < 8) {
      errors.push({
        field: 'password',
        message: 'Le mot de passe doit contenir au moins 8 caracères',
      })
    }
    if (!/[a-z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Le mot de passe doit contenir au moins une minuscule.',
      })
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Le mot de passe doit contenir au moins une majuscule.',
      })
    }
    if (!/\d/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Le mot de passe doit contenir au moins un chiffre.',
      })
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push({
        field: 'password',
        message: `Le mot de passe doit contenir au moins un caractère spécial parmi : ${ALLOWED_SPECIAL_CHARS}`,
      })
    }
    if (/[^A-Za-z\d@$!%*?&]/.test(password)) {
      errors.push({
        field: 'password',
        message: `Le mot de passe ne peut contenir que des lettres, des chiffres et les caractères spéciaux : ${ALLOWED_SPECIAL_CHARS}`,
      })
    }

    if (errors.length === 0) {
      errors.push({
        field: 'password',
        message: 'Le mot de passe ne respecte pas les règles de sécurité.',
      })
    }
  }
  return errors
}
