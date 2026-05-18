<script setup lang="ts">
import { computed } from 'vue'

interface ServiceCardData {
  title: string
  image_url: string | null
}

const props = defineProps<{
  service: ServiceCardData
  price: string
}>()

const formattedPrice = computed(() => {
  const n = Number(props.price)
  return Number.isFinite(n) ? `${n.toFixed(2)} €` : `${props.price} €`
})
</script>

<template>
  <div class="flex gap-4">
    <img
      v-if="service.image_url"
      :src="service.image_url"
      :alt="service.title"
      class="w-24 h-24 object-cover rounded-lg shrink-0"
    />
    <div v-else class="w-24 h-24 bg-slate-100 rounded-lg shrink-0" />

    <div class="flex-1 min-w-0">
      <p class="font-medium text-slate-900 line-clamp-2 mb-2">
        {{ service.title }}
      </p>
      <p class="text-lg font-semibold text-slate-900">
        {{ formattedPrice }}
      </p>
    </div>
  </div>
</template>
