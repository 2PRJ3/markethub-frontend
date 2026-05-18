<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import TheNavbar from '@/components/TheNavbar.vue'
import TheBriefForm from '@/components/forms/TheBriefForm.vue'
import { useServiceStore } from '@/stores/serviceStore'
import { useOrderStore } from '@/stores/orderStore'
import { useLoginStore } from '@/stores/loginStore'
import TheOrderRecap from '@/components/orders/TheOrderRecap.vue'

const route = useRoute()
const router = useRouter()

const serviceStore = useServiceStore()
const orderStore = useOrderStore()
const loginStore = useLoginStore()

const { currentService, loading: serviceLoading } = storeToRefs(serviceStore)
const { loading: orderLoading } = storeToRefs(orderStore)
const { user } = storeToRefs(loginStore)

const serviceId = computed(() => Number(route.params.id))

const submitError = ref<string | null>(null)
const idempotencyKey = ref<string>('')

const isOwnService = computed(
  () =>
    currentService.value !== null &&
    user.value !== null &&
    currentService.value.seller_id === user.value.id,
)

const formattedPrice = computed(() => {
  if (!currentService.value) return ''
  const n = Number(currentService.value.price)
  return Number.isFinite(n) ? n.toFixed(2) : currentService.value.price
})

onMounted(async () => {
  idempotencyKey.value = crypto.randomUUID()
  await serviceStore.fetchServiceById(serviceId.value)
})

async function handleBriefSubmit(brief: string): Promise<void> {
  if (!currentService.value) return
  submitError.value = null

  try {
    const order = await orderStore.createOrder({
      items: [{ service_id: currentService.value.id }],
      brief,
      idempotency_key: idempotencyKey.value,
    })
    router.push({ name: 'order-pay', params: { id: order.id } })
  } catch {
    submitError.value =
      'Une erreur est survenue lors de la création de la commande. Veuillez réessayer.'
  }
}

function handleCancel(): void {
  router.push({ name: 'service-detail', params: { id: serviceId.value } })
}
</script>
<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="serviceLoading && !currentService" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <Skeleton height="2.5rem" width="40%" />
        <Skeleton height="14rem" />
      </div>
      <div>
        <Skeleton height="14rem" class="rounded-xl" />
      </div>
    </div>

    <div v-else-if="!currentService" class="text-center py-12">
      <p class="text-slate-600 mb-4">Service introuvable.</p>
      <Button label="Retour au catalogue" @click="router.push('/catalogue')" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulaire brief -->
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Décrivez votre besoin</h1>
        <p class="text-slate-600 mb-6">
          Plus votre brief est détaillé, plus le vendeur pourra vous proposer un travail adapté.
        </p>

        <Message v-if="isOwnService" severity="warn" :closable="false" class="mb-4">
          Vous ne pouvez pas commander votre propre service.
        </Message>

        <TheBriefForm
          :disabled="isOwnService"
          :submitting="orderLoading"
          :submit-error="submitError"
          @submit="handleBriefSubmit"
          @cancel="handleCancel"
        />
      </div>

      <!-- Récap service -->
      <aside class="lg:col-span-1">
        <TheOrderRecap :service="currentService" />
      </aside>
    </div>
  </div>
</template>
