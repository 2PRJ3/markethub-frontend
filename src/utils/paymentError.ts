import type { PaymentFailureReason } from '@/types/order'

export const PAYMENT_ERROR_MESSAGES: Record<PaymentFailureReason, string> = {
  card_declined: 'Votre carte a été refusée. Vérifiez vos informations ou essayez une autre carte.',
  insufficient_funds: 'Fonds insuffisants sur cette carte.',
  processing_error: 'Une erreur est survenue lors du traitement. Veuillez réessayer.',
  invalid_card: 'Le numéro de carte est invalide.',
}

const DEFAULT_PAYMENT_ERROR = 'Une erreur est survenue lors du paiement. Veuillez réessayer.'

export function getPaymentErrorMessage(reason: string | undefined | null): string {
  if (!reason) return DEFAULT_PAYMENT_ERROR
  if (reason in PAYMENT_ERROR_MESSAGES) {
    return PAYMENT_ERROR_MESSAGES[reason as PaymentFailureReason]
  }
  return DEFAULT_PAYMENT_ERROR
}
