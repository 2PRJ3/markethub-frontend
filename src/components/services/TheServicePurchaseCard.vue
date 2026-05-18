<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import type { ServiceRead } from '@/types/service'

const props = defineProps<{
  service: ServiceRead
}>()

const router = useRouter()

const formattedPrice = computed(() => {
  const n = Number(props.service.price)
  return Number.isFinite(n) ? n.toFixed(0) : props.service.price
})

function goToOrder(): void {
  router.push({ name: 'order-brief', params: { id: props.service.id } })
}
</script>

<template>
  <div class="sticky top-4 border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <span class="text-3xl font-bold text-slate-900">Prix : {{ formattedPrice }} €</span>
    </div>

    <div class="space-y-3">
      <Button label="Commander" class="w-full bg-[#3525CD] border-[#3525CD]" @click="goToOrder" />
      <Button
        label="Contacter le vendeur"
        outlined
        severity="info"
        class="w-full border-slate-300 text-slate-700"
      />
    </div>

    <div class="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
      <i class="pi pi-shield" />
      <span>Paiement 100% sécurisé par MarketHub</span>
    </div>
  </div>
</template>
