<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { AxiosError } from 'axios'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'

import TheNavbar from '@/components/TheNavbar.vue'
import ThePaymentForm from '@/components/forms/ThePaymentForm.vue'
import TheOrderRecap from '@/components/orders/TheOrderRecap.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useLoginStore } from '@/stores/loginStore'
import { getPaymentErrorMessage } from '@/utils/paymentError'
import type { PaymentPayload, PaymentFailureResponse } from '@/types/order'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const orderStore = useOrderStore()
const loginStore = useLoginStore()

const { currentOrder, loading: orderLoading } = storeToRefs(orderStore)
const { user } = storeToRefs(loginStore)

const orderId = computed(() => Number(route.params.id))

const paying = ref<boolean>(false)
const cancelling = ref<boolean>(false)
const submitError = ref<string | null>(null)

const firstItem = computed(() => currentOrder.value?.items[0] ?? null)

const recapService = computed(() => {
  if (!firstItem.value) return null
  return {
    title: firstItem.value.service.title,
    price: firstItem.value.service.price,
    image_url: firstItem.value.service.image_url,
    seller: firstItem.value.seller,
  }
})

onMounted(async () => {
  try {
    await orderStore.fetchOrderById(orderId.value)
  } catch {
    router.push({ name: 'my-orders' })
    return
  }

  if (!currentOrder.value) {
    router.push({ name: 'my-orders' })
    return
  }

  // Guard: order must belong to the current user
  if (user.value && currentOrder.value.buyer_id !== user.value.id) {
    router.push({ name: 'my-orders' })
    return
  }

  // Guard: order must be pending
  if (currentOrder.value.status !== 'pending') {
    if (currentOrder.value.status === 'paid' || currentOrder.value.status === 'completed') {
      router.push({
        name: 'order-confirmation',
        params: { id: currentOrder.value.id },
      })
    } else {
      router.push({ name: 'my-orders' })
    }
  }
})

async function handlePaymentSubmit(payment: PaymentPayload): Promise<void> {
  if (!currentOrder.value || paying.value) return

  paying.value = true
  submitError.value = null

  const idempotencyKey = crypto.randomUUID()

  try {
    await orderStore.payOrder(currentOrder.value.id, payment, idempotencyKey)
    router.push({
      name: 'order-confirmation',
      params: { id: currentOrder.value.id },
    })
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 402) {
      const data = error.response.data as PaymentFailureResponse
      submitError.value = getPaymentErrorMessage(data.reason)
    } else {
      submitError.value = getPaymentErrorMessage(null)
    }
  } finally {
    paying.value = false
  }
}

async function handleCancel(): Promise<void> {
  if (!currentOrder.value || cancelling.value) return
  cancelling.value = true

  try {
    await orderStore.cancelOrder(currentOrder.value.id)
    toast.add({
      severity: 'info',
      summary: 'Commande annulée',
      detail: 'Votre commande a bien été annulée.',
      life: 3000,
    })
    setTimeout(() => {
      router.push({ name: 'my-orders' })
    }, 1500)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "L'annulation a échoué. Veuillez réessayer.",
      life: 3000,
    })
    cancelling.value = false
  }
}

function handleClearError(): void {
  submitError.value = null
}
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="orderLoading && !currentOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <Skeleton height="2.5rem" width="40%" />
        <Skeleton height="20rem" />
      </div>
      <div>
        <Skeleton height="14rem" class="rounded-xl" />
      </div>
    </div>

    <div v-else-if="!currentOrder" class="text-center py-12">
      <p class="text-slate-600 mb-4">Commande introuvable.</p>
      <Button label="Mes commandes" @click="router.push('/my-orders')" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Paiement</h1>
        <p class="text-slate-600 mb-6">
          Commande #{{ currentOrder.id }} — Renseignez vos informations de paiement pour finaliser
          votre commande.
        </p>

        <!--        <Message severity="info" :closable="false" class="mb-4">-->
        <!--          <i class="pi pi-shield mr-2" />-->
        <!--          Paiement simulé : aucune transaction réelle ne sera effectuée.-->
        <!--        </Message>-->

        <ThePaymentForm
          :submitting="paying"
          :submit-error="submitError"
          @submit="handlePaymentSubmit"
          @cancel="handleCancel"
          @clear-error="handleClearError"
        />
      </div>

      <aside class="lg:col-span-1">
        <TheOrderRecap
          v-if="recapService"
          :service="recapService"
          title="Récapitulatif"
          total-label="Total à payer"
          :total-amount="currentOrder.total_amount"
        />
      </aside>
    </div>
  </div>
</template>
