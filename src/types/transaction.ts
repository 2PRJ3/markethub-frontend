export type TransactionType = 'payment' | 'refund'
export type TransactionStatus = 'pending' | 'success' | 'failed'

export interface TransactionRead {
  id: number
  order_id: number
  user_id: number
  amount: string
  type: TransactionType
  status: TransactionStatus
  reference: string
  created_at: string
}

export interface PaymentSuccessResponse {
  transaction: TransactionRead
  order: {
    id: number
    status: 'paid'
  }
}
