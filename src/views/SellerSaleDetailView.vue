<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Panel from 'primevue/panel'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'

import TheNavbar from '@/components/TheNavbar.vue'
import TheStatusBadge from '@/components/orders/TheStatusBadge.vue'
import TheSellerSaleStatusMessage from '@/components/seller/TheSellerSaleStatusMessage.vue'
import TheSellerSaleBuyerCard from '@/components/seller/TheSellerSaleBuyerCard.vue'
import TheServiceItemCard from '@/components/seller/TheServiceItemCard.vue'

import { useOrderStore } from '@/stores/orderStore'
import { useLoginStore } from '@/stores/loginStore'
import type { OrderItemRead, OrderItemStatus } from '@/types/order'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const orderStore = useOrderStore()
const loginStore = useLoginStore()

const { mySales, currentOrder, loading: orderLoading } = storeToRefs(orderStore)
const { user } = storeToRefs(loginStore)

const itemId = computed(() => Number(route.params.itemId))

const updating = ref<boolean>(false)
const notFound = ref<boolean>(false)

const currentItem = computed<OrderItemRead | null>(() => {
  if (!currentOrder.value || !user.value) return null
  return (
    currentOrder.value.items.find((i) => i.id === itemId.value && i.seller_id === user.value!.id) ??
    null
  )
})

onMounted(async () => {
  if (mySales.value.length === 0) {
    try {
      await orderStore.fetchMySales({ skip: 0, limit: 50 })
    } catch {
      notFound.value = true
      return
    }
  }

  const sale = mySales.value.find((s) => s.id === itemId.value)
  if (!sale) {
    notFound.value = true
    return
  }

  try {
    await orderStore.fetchOrderById(sale.order.id)
  } catch {
    notFound.value = true
    return
  }

  if (!currentItem.value) {
    notFound.value = true
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

function goBack(): void {
  router.push({ name: 'profil-user' })
}

async function handleAdvance(nextStatus: OrderItemStatus): Promise<void> {
  if (!currentOrder.value || !currentItem.value) return
  updating.value = true

  try {
    await orderStore.updateItemStatus(currentOrder.value.id, currentItem.value.id, nextStatus)
    toast.add({
      severity: 'success',
      summary: 'Statut mis à jour',
      detail: 'Le statut de la vente a bien été mis à jour.',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'La mise à jour a échoué. Veuillez réessayer.',
      life: 3000,
    })
  } finally {
    updating.value = false
  }
}

function handleContactBuyer(): void {
  toast.add({
    severity: 'info',
    summary: 'Bientôt disponible',
    detail: 'La messagerie sera disponible prochainement.',
    life: 3000,
  })
}
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-5xl mx-auto px-4 py-8">
    <Button
      label="Retour à mes ventes"
      icon="pi pi-arrow-left"
      severity="secondary"
      text
      class="mb-4"
      @click="goBack"
    />

    <div v-if="orderLoading && !currentItem" class="space-y-4">
      <Skeleton height="3rem" width="50%" />
      <Skeleton height="14rem" />
      <Skeleton height="10rem" />
    </div>

    <div v-else-if="notFound || !currentItem || !currentOrder" class="text-center py-12">
      <p class="text-slate-600 mb-4">Vente introuvable.</p>
      <Button label="Retour à mon profil" @click="goBack" />
    </div>

    <div v-else class="flex flex-col gap-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Vente — Commande #{{ currentOrder.id }}</h1>
          <p class="text-slate-500 text-sm mt-1">Commandée le {{ formattedDate }}</p>
        </div>
        <TheStatusBadge :status="currentItem.status" />
      </div>

      <TheSellerSaleStatusMessage
        :status="currentItem.status"
        :updating="updating"
        @advance="handleAdvance"
      />

      <Panel header="Brief de l'acheteur">
        <p class="whitespace-pre-wrap text-slate-700">
          {{ currentOrder.brief }}
        </p>
      </Panel>

      <Panel header="Détails">
        <div class="flex flex-col gap-4">
          <TheServiceItemCard :service="currentItem.service" :price="currentItem.unit_price" />

          <Divider class="my-0" />

          <TheSellerSaleBuyerCard :buyer="currentOrder.buyer" @contact="handleContactBuyer" />
        </div>
      </Panel>
    </div>
  </div>
</template>
