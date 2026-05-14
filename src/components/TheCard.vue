<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Rating from 'primevue/rating'

import imagedefault from '@/assets/pictures/Background.png'
import avatar from '@/assets/pictures/avatar.png'
import type { ServiceSummary } from '@/types/service'

const props = defineProps<{
  service: ServiceSummary
}>()

const formattedPrice = computed(() => {
  const n = Number(props.service.price)
  return Number.isFinite(n) ? n.toFixed(0) : props.service.price
})

const sellerName = computed(() => {
  const seller = props.service.seller
  if (!seller) return 'Anonyme'
  const lastInitial = seller.last_name?.[0] ? `${seller.last_name[0]}.` : ''
  return `${seller.first_name} ${lastInitial}`.trim()
})

const sellerAvatar = computed(() => {
  const url = props.service.seller?.avatar_url
  return url && url !== 'string' ? url : avatar
})

const ratingDisplay = computed(() =>
  props.service.average_rating !== null ? props.service.average_rating.toFixed(1) : '—',
)
</script>

<template>
  <Card style="overflow: hidden">
    <template #header>
      <div class="relative">
        <img
          :src="props.service.image_url || imagedefault"
          :alt="props.service.title"
          class="w-full h-48 object-cover"
        />
        <Tag
          v-if="props.service.category"
          :value="props.service.category"
          severity="info"
          class="absolute"
          style="left: 5px; top: 5px"
        />
      </div>
    </template>
    <template #title>
      <div class="flex items-center gap-3">
        <Avatar :image="sellerAvatar" shape="circle" />
        <span class="text-sm">{{ sellerName }}</span>
      </div>
      <div>
        <p class="font-semibold text-gray-900 line-clamp-2 min-h-10">
          {{ props.service.title }}
        </p>
      </div>
    </template>

    <template #content> </template>

    <template #footer>
      <div class="flex justify-between items-center gap-3">
        <div class="flex items-center gap-2">
          <Rating
            :stars="1"
            :pt="{
              onIcon: { class: 'pi pi-star-fill !text-yellow-400 hover:border-none' },
              offIcon: { class: 'pi pi-star-fill !text-yellow-400 hover:border-none' },
            }"
          />
          <span>{{ ratingDisplay }}</span>
        </div>

        <div>
          <span class="text-gray-950">Dés {{ formattedPrice }} €</span>
        </div>
      </div>
    </template>
  </Card>
</template>
