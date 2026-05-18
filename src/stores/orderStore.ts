import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

import type {
  OrderRead,
  BuyerOrderSummary,
  SellerSaleSummary,
  OrderCreatePayload,
  OrderListParams,
  PaymentPayload,
} from '@/types/order'

import type { PaymentSuccessResponse } from '@/types/transaction'

export const useOrderStore = defineStore('orderStore', () => {
  const currentOrder = ref<OrderRead | null>(null)
  const myOrders = ref<BuyerOrderSummary[]>([])
  const mySales = ref<SellerSaleSummary[]>([])
  const loading = ref<boolean>(false)

  async function createOrder(payload: OrderCreatePayload): Promise<OrderRead> {
    loading.value = true
    try {
      const { data } = await api.post<OrderRead>('/orders', payload)
      currentOrder.value = data
      return data
    } catch (error) {
      console.error('Création de  commande a échoué', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id: number): Promise<void> {
    loading.value = true
    try {
      const { data } = await api.get<OrderRead>(`/orders/${id}`)
      currentOrder.value = data
    } catch (error) {
      console.error('Problème lors de la récupération de la commande', error)
      currentOrder.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  async function payOrder(
    id: number,
    payment: PaymentPayload,
    idempotency_key: string,
  ): Promise<PaymentSuccessResponse> {
    loading.value = true
    try {
      const { data } = await api.post<PaymentSuccessResponse>(`/orders/${id}/pay`, payment, {
        headers: { Idempotency_key: idempotency_key },
      })
      if (currentOrder.value && currentOrder.value.id == id) {
        currentOrder.value.status = data.order.status
      }
      return data
    } catch (error) {
      console.error('Paiement échoué', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(id: number): Promise<void> {
    loading.value = true
    try {
      await api.post(`/orders/${id}/cancel`)
      if (currentOrder.value && currentOrder.value.id == id) {
        currentOrder.value.status = 'canceled'
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la commande", error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMyOrders(params: OrderListParams = {}): Promise<void> {
    loading.value = true
    try {
      const { data } = await api.get<BuyerOrderSummary[]>('/orders/me', {
        params,
      })
      myOrders.value = data
    } catch (error) {
      console.error('Fetch my orders failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  async function fetchMySales(params: OrderListParams = {}): Promise<void> {
    loading.value = true
    try {
      const { data } = await api.get<SellerSaleSummary[]>('/orders/me/sales', {
        params,
      })
      mySales.value = data
    } catch (error) {
      console.error('Fetch my sales failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function resetCurrentOrder(): void {
    currentOrder.value = null
  }

  return {
    currentOrder,
    myOrders,
    mySales,
    loading,
    createOrder,
    fetchOrderById,
    payOrder,
    cancelOrder,
    fetchMyOrders,
    fetchMySales,
    resetCurrentOrder,
  }
})
