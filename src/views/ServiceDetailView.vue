<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'

import Skeleton from 'primevue/skeleton'
import TheNavbar from '@/components/TheNavbar.vue'
import { useServiceStore } from '@/stores/serviceStore'

import TheServiceSellerCard from '@/components/services/TheServiceSellerCard.vue'
import TheServiceDetailPresentation from '@/components/services/TheServiceDetailPresentation.vue'
import TheServicePurchaseCard from '@/components/services/TheServicePurchaseCard.vue'

const route = useRoute()
const router = useRouter()
const serviceStore = useServiceStore()
const { currentService, loading } = storeToRefs(serviceStore)

const serviceId = computed(() => Number(route.params.id))

onMounted(() => {
  serviceStore.fetchServiceById(serviceId.value)
})
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="loading && !currentService" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <Skeleton height="2.5rem" width="60%" />
        <Skeleton height="1rem" width="30%" />
        <Skeleton height="24rem" class="rounded-xl" />
        <Skeleton height="8rem" />
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
      <div class="lg:col-span-2">
        <TheServiceDetailPresentation :service="currentService" />

        <TheServiceSellerCard
          :seller="currentService.seller"
          :created-at="currentService.created_at"
        />
      </div>
      <aside class="lg:col-span-1">
        <TheServicePurchaseCard :service="currentService" />
      </aside>
    </div>
  </div>
</template>
