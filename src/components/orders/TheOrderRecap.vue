<script setup lang="ts">
import { computed } from 'vue'
import type { SellerSummary } from '@/types/service'

interface RecapService {
  title: string
  price: string
  image_url: string | null
  seller?: SellerSummary
}

const props = defineProps<{
  service: RecapService
  title?: string
  totalLabel?: string
  totalAmount?: string | null
}>()

const headerTitle = computed(() => props.title ?? 'Récapitulatif')
const totalLabelText = computed(() => props.totalLabel ?? 'Total')

const formattedTotal = computed(() => {
  const raw = props.totalAmount ?? props.service.price
  const n = Number(raw)
  return Number.isFinite(n) ? n.toFixed(2) : raw
})
</script>

<template>
  <div class="sticky top-4 border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
    <h2 class="text-lg font-semibold text-slate-900 mb-4">
      {{ headerTitle }}
    </h2>

    <div class="flex gap-3 mb-4">
      <img
        v-if="service.image_url"
        :src="service.image_url"
        :alt="service.title"
        class="w-20 h-20 object-cover rounded-lg shrink-0"
      />
      <div v-else class="w-20 h-20 bg-slate-100 rounded-lg shrink-0" />

      <div class="flex-1 min-w-0">
        <p class="font-medium text-slate-900 line-clamp-2">
          {{ service.title }}
        </p>
        <p v-if="service.seller" class="text-xs text-slate-500 mt-1">
          par {{ service.seller.first_name }} {{ service.seller.last_name }}
        </p>
      </div>
    </div>

    <div class="border-t border-slate-200 pt-4 flex justify-between items-center">
      <span class="text-slate-600">{{ totalLabelText }}</span>
      <span class="text-2xl font-bold text-slate-900"> {{ formattedTotal }} € </span>
    </div>
  </div>
</template>
