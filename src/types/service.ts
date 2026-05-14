export type ServiceStatus = 'active' | 'inactive' | 'banned'

export type StepKey = 1 | 2 | 3

export interface Category {
  id: number
  name: string
  slug: string
}

export interface SellerSummary {
  id: number
  first_name: string
  last_name: string
  avatar_url: string | null
  university: string | null
}

export interface ServiceRead {
  id: number
  seller_id: number
  category_id: number
  title: string
  description: string
  price: number
  image_url: string | null
  status: ServiceStatus
  average_rating: number
  reviews_count: number
  created_at: string
  updated_at: string
  category?: Category
  seller?: SellerSummary
}

export interface ServiceCreatePayload {
  category_id: number
  title: string
  description: string
  price: number
  image_url: string | null
}

export interface ServiceUpdatePayload {
  category_id?: number
  title?: string
  description?: string
  price?: number
  image_url?: string | null
  status?: ServiceStatus
}

export interface ServiceSummary {
  id: number
  title: string
  price: number
  image_url: string | null
  average_rating: number
  reviews_count: number
  category?: Category
}

export interface PaginatedServices {
  items: ServiceSummary[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ServiceDraft {
  title: string
  category_id: number | null
  price: number | null
  description: string
  image_file: File | null
  image_preview: string | null
}

export interface StepValidation {
  valid: boolean
  errors: Record<string, string>
}
