import { isLuhnValid } from '@/utils/luhn'

export function validateCardNumber(value: string): string | null {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 'Le numéro de carte est requis'
  }
  if (digits.length < 12 || digits.length > 19) {
    return 'Le numéro de carte doit contenir entre 12 et 19 chiffres'
  }
  if (!isLuhnValid(digits)) {
    return 'Numéro de carte invalide'
  }
  return null
}

export function validateCardHolder(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Le nom du titulaire est requis'
  }
  if (trimmed.length < 2) {
    return 'Minimum 2 caractères'
  }
  if (trimmed.length > 100) {
    return 'Maximum 100 caractères'
  }
  return null
}

export function validateExpiry(value: string): string | null {
  if (!value) {
    return "La date d'expiration est requise"
  }

  const match = value.match(/^(\d{2})\/(\d{2})$/)
  if (!match) {
    return 'Format attendu : MM/AA'
  }

  const month = Number(match[1])
  const year = Number(match[2])

  if (month < 1 || month > 12) {
    return 'Mois invalide (01-12)'
  }

  const fullYear = 2000 + year
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return 'La carte est expirée'
  }

  if (fullYear > currentYear + 20) {
    return "L'année que vous avez rentré est invalide"
  }

  return null
}

export function validateCvv(value: string): string | null {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 'Le CVV est requis'
  }
  if (digits.length < 3 || digits.length > 4) {
    return 'Le CVV doit contenir 3 ou 4 chiffres'
  }
  return null
}

export function formatExpiryForApi(value: string): string {
  const match = value.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return value
  return `20${match[2]}-${match[1]}`
}

export function stripCardNumber(value: string): string {
  return value.replace(/\D/g, '')
}
