import type { SellerSummary } from './service'

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'canceled'

export type OrderItemStatus = 'pending' | 'in_progress' | 'delivered' | 'completed' | 'canceled'

export interface OrderServiceSnapshot {
  id: number
  title: string
  price: string
  image_url: string | null
  average_rating: number | null
  reviews_count: number
  created_at: string
  seller?: SellerSummary
}

export interface OrderItemRead {
  id: number
  service_id: number
  seller_id: number
  unit_price: string
  status: OrderItemStatus
  created_at: string
  service: OrderServiceSnapshot
  seller: SellerSummary
}

export interface OrderRead {
  id: number
  buyer_id: number
  total_amount: string
  status: OrderStatus
  brief: string
  idempotency_key: string
  created_at: string
  updated_at: string
  items: OrderItemRead[]
  buyer: SellerSummary
}

export interface BuyerOrderSummary {
  id: number
  total_amount: string
  status: OrderStatus
  items_count: number
  created_at: string
}

export interface SaleOrderContext {
  id: number
  buyer: SellerSummary
  brief: string
  created_at: string
}

export interface SellerSaleSummary {
  id: number
  service: OrderServiceSnapshot
  unit_price: string
  status: OrderItemStatus
  created_at: string
  order: SaleOrderContext
}

export interface OrderCreateItemPayload {
  service_id: number
}

export interface OrderCreatePayload {
  items: OrderCreateItemPayload[]
  brief: string
  idempotency_key: string
}

export interface OrderListParams {
  skip?: number
  limit?: number
}

export interface OrderItemStatusUpdatePayload {
  status: OrderItemStatus
}
export interface PaymentPayload {
  card_number: string
  card_holder: string
  expiry: string
  cvv: string
}

export type PaymentFailureReason =
  | 'card_declined'
  | 'insufficient_funds'
  | 'processing_error'
  | 'invalid_card'

export interface PaymentFailureResponse {
  detail: string
  reason: PaymentFailureReason
  transaction_id: number
}
