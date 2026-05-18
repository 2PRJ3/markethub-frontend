<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'
import Panel from 'primevue/panel'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'

import TheNavbar from '@/components/TheNavbar.vue'
import TheStatusBadge from '@/components/orders/TheStatusBadge.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useLoginStore } from '@/stores/loginStore'
import { useTransactionStore } from '@/stores/transactionStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const orderStore = useOrderStore()
const loginStore = useLoginStore()
const transactionStore = useTransactionStore()

const { currentOrder, loading: orderLoading } = storeToRefs(orderStore)
const { user } = storeToRefs(loginStore)
const { orderTransactions } = storeToRefs(transactionStore)

const orderId = computed(() => Number(route.params.id))

const cancelling = ref<boolean>(false)
const notFound = ref<boolean>(false)

const successfulPayment = computed(() =>
  orderTransactions.value.find((t) => t.type === 'payment' && t.status === 'success'),
)

onMounted(async () => {
  try {
    await orderStore.fetchOrderById(orderId.value)
  } catch {
    notFound.value = true
    return
  }

  if (!currentOrder.value) {
    notFound.value = true
    return
  }

  if (user.value && currentOrder.value.buyer_id !== user.value.id) {
    router.push({ name: 'profil-user' })
    return
  }

  if (currentOrder.value.status === 'paid' || currentOrder.value.status === 'completed') {
    try {
      await transactionStore.fetchByOrderId(orderId.value)
    } catch {
    }
  }
})

const formattedDate = computed(() => {
  if (!currentOrder.value) return ''
  return new Date(currentOrder.value.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const paymentDate = computed(() => {
  if (!successfulPayment.value) return ''
  return new Date(successfulPayment.value.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const formattedTotal = computed(() => {
  if (!currentOrder.value) return ''
  const n = Number(currentOrder.value.total_amount)
  return Number.isFinite(n) ? `${n.toFixed(2)} €` : `${currentOrder.value.total_amount} €`
})

function formatItemPrice(price: string): string {
  const n = Number(price)
  return Number.isFinite(n) ? `${n.toFixed(2)} €` : `${price} €`
}

function goBack(): void {
  router.push({ name: 'profil-user' })
}

function resumePayment(): void {
  if (!currentOrder.value) return
  router.push({ name: 'order-pay', params: { id: currentOrder.value.id } })
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
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "L'annulation a échoué. Veuillez réessayer.",
      life: 3000,
    })
  } finally {
    cancelling.value = false
  }
}

function goToService(serviceId: number): void {
  router.push({ name: 'service-detail', params: { id: serviceId } })
}
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-5xl mx-auto px-4 py-8">
    <Button
      label="Retour à mes commandes"
      icon="pi pi-arrow-left"
      severity="secondary"
      text
      class="mb-4"
      @click="goBack"
    />

    <div v-if="orderLoading && !currentOrder" class="space-y-4">
      <Skeleton height="3rem" width="50%" />
      <Skeleton height="14rem" />
      <Skeleton height="10rem" />
    </div>

    <div v-else-if="notFound || !currentOrder" class="text-center py-12">
      <p class="text-slate-600 mb-4">Commande introuvable.</p>
      <Button label="Retour à mon profil" @click="goBack" />
    </div>

    <div v-else class="flex flex-col gap-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Commande #{{ currentOrder.id }}</h1>
          <p class="text-slate-500 text-sm mt-1">Passée le {{ formattedDate }}</p>
        </div>
        <TheStatusBadge :status="currentOrder.status" />
      </div>

      <Message v-if="currentOrder.status === 'pending'" severity="warn" :closable="false">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>Cette commande est en attente de paiement.</span>
          <div class="flex gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              size="small"
              :loading="cancelling"
              @click="handleCancel"
            />
            <Button
              label="Reprendre le paiement"
              icon="pi pi-credit-card"
              size="small"
              class="bg-[#3525CD] border-[#3525CD]"
              @click="resumePayment"
            />
          </div>
        </div>
      </Message>

      <Panel v-if="successfulPayment" header="Paiement">
        <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <p class="text-sm text-slate-500">Référence de transaction</p>
            <code
              class="inline-block mt-1 text-sm bg-slate-100 px-2 py-1 rounded font-mono text-slate-800"
            >
              {{ successfulPayment.reference }}
            </code>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Date de paiement</p>
            <p class="mt-1 text-slate-800">{{ paymentDate }}</p>
          </div>
        </div>
      </Panel>

      <Panel header="Votre brief">
        <p class="whitespace-pre-wrap text-slate-700">
          {{ currentOrder.brief }}
        </p>
      </Panel>

      <Panel header="Services commandés">
        <div class="flex flex-col gap-4">
          <div v-for="(item, index) in currentOrder.items" :key="item.id">
            <div class="flex gap-4">
              <img
                v-if="item.service.image_url"
                :src="item.service.image_url"
                :alt="item.service.title"
                class="w-24 h-24 object-cover rounded-lg shrink-0 cursor-pointer"
                @click="goToService(item.service_id)"
              />
              <div v-else class="w-24 h-24 bg-slate-100 rounded-lg shrink-0" />

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <button
                    type="button"
                    class="text-left font-medium text-slate-900 hover:text-[#3525CD] line-clamp-2"
                    @click="goToService(item.service_id)"
                  >
                    {{ item.service.title }}
                  </button>
                  <TheStatusBadge :status="item.status" />
                </div>
                <p class="text-sm text-slate-500 mb-1">
                  Vendu par {{ item.seller.first_name }}
                  {{ item.seller.last_name }}
                </p>
                <p class="text-lg font-semibold text-slate-900">
                  {{ formatItemPrice(item.unit_price) }}
                </p>
              </div>
            </div>

            <Divider v-if="index < currentOrder.items.length - 1" class="my-3" />
          </div>
        </div>
      </Panel>

      <Panel>
        <div class="flex justify-between items-center">
          <span class="text-lg text-slate-700">Total</span>
          <span class="text-2xl font-bold text-slate-900">
            {{ formattedTotal }}
          </span>
        </div>
      </Panel>
    </div>
  </div>
</template>
