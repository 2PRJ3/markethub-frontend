import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { TransactionRead } from '@/types/transaction'

export const useTransactionStore = defineStore('transactionStore', () => {
  const orderTransactions = ref<TransactionRead[]>([])
  const loading = ref<boolean>(false)

  async function fetchByOrderId(orderId: number): Promise<void> {
    loading.value = true
    try {
      const { data } = await api.get<TransactionRead[]>('/transactions/me')
      orderTransactions.value = data.filter((t) => t.order_id === orderId)
    } catch (error) {
      console.error('Fetch transactions failed:', error)
      orderTransactions.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    orderTransactions.value = []
  }

  return {
    orderTransactions,
    loading,
    fetchByOrderId,
    reset,
  }
})
