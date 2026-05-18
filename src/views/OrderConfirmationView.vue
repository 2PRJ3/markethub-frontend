<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import TheNavbar from '@/components/TheNavbar.vue'
import TheOrderRecap from '@/components/orders/TheOrderRecap.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useLoginStore } from '@/stores/loginStore'

const route = useRoute()
const router = useRouter()

const orderStore = useOrderStore()
const loginStore = useLoginStore()

const { currentOrder, loading: orderLoading } = storeToRefs(orderStore)
const { user } = storeToRefs(loginStore)

const orderId = computed(() => Number(route.params.id))

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

  if (user.value && currentOrder.value.buyer_id !== user.value.id) {
    router.push({ name: 'my-orders' })
    return
  }

  if (currentOrder.value.status !== 'paid' && currentOrder.value.status !== 'completed') {
    if (currentOrder.value.status === 'pending') {
      router.push({
        name: 'order-pay',
        params: { id: currentOrder.value.id },
      })
    } else {
      router.push({ name: 'my-orders' })
    }
  }
})

function goToOrders(): void {
  router.push({ name: 'my-orders' })
}

function goToCatalogue(): void {
  router.push('/catalogue')
}
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="orderLoading && !currentOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <Skeleton height="3rem" width="60%" />
        <Skeleton height="14rem" />
      </div>
      <div>
        <Skeleton height="14rem" class="rounded-xl" />
      </div>
    </div>

    <div v-else-if="!currentOrder" class="text-center py-12">
      <p class="text-slate-600 mb-4">Commande introuvable.</p>
      <Button label="Mes commandes" @click="goToOrders" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
          >
            <i class="pi pi-check text-3xl text-green-600" />
          </div>
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Paiement réussi !</h1>
          <p class="text-slate-600">
            Votre commande #{{ currentOrder.id }} a bien été enregistrée.
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Prochaines étapes</h2>
          <ul class="space-y-3 text-sm text-slate-700">
            <li class="flex gap-3">
              <i class="pi pi-envelope text-[#3525CD] mt-0.5" />
              <span>
                Le vendeur a été notifié de votre commande et va prendre contact avec vous
                prochainement.
              </span>
            </li>
            <li class="flex gap-3">
              <i class="pi pi-comments text-[#3525CD] mt-0.5" />
              <span>
                Vous pouvez suivre l'avancement de votre commande et échanger avec le vendeur depuis
                la messagerie.
              </span>
            </li>
            <li class="flex gap-3">
              <i class="pi pi-star text-[#3525CD] mt-0.5" />
              <span> Une fois le travail livré, vous pourrez laisser un avis au vendeur. </span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            label="Voir mes commandes"
            icon="pi pi-list"
            class="bg-[#3525CD] border-[#3525CD]"
            @click="goToOrders"
          />
          <Button
            label="Continuer mes achats"
            severity="secondary"
            outlined
            @click="goToCatalogue"
          />
        </div>
      </div>

      <aside class="lg:col-span-1">
        <TheOrderRecap
          v-if="recapService"
          :service="recapService"
          title="Récapitulatif"
          total-label="Montant payé"
          :total-amount="currentOrder.total_amount"
        />
      </aside>
    </div>
  </div>
</template>
