<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Rating from 'primevue/rating'

import imagedefault from '@/assets/pictures/background.png'
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
  <RouterLink :to="`/services/${props.service.id}`">
    <Card
      :pt="{
        root: {
          class:
            'overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        },
        body: { class: 'p-0' },
        header: { class: 'p-0' },
        content: { class: 'p-0' },
        footer: { class: 'p-0' },
      }"
    >
      <template #header>
        <div class="relative overflow-hidden">
          <img
            :src="props.service.image_url || imagedefault"
            :alt="props.service.title"
            class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <Tag
            v-if="props.service.category"
            :value="props.service.category"
            class="absolute top-3 left-3 bg-white text-slate-700! font-medium shadow-sm"
          />
        </div>
      </template>

      <template #content>
        <div class="px-4 pt-4 pb-3">
          <div class="flex items-center gap-2 mb-3">
            <Avatar :image="sellerAvatar" shape="circle" size="normal" />
            <span class="text-sm text-slate-600 font-medium">{{ sellerName }}</span>
          </div>

          <p class="font-semibold text-slate-900 line-clamp-2 min-h-12 leading-snug">
            {{ props.service.title }}
          </p>
        </div>
      </template>

      <template #footer>
        <div
          class="flex justify-between items-center px-4 py-3 border-t border-slate-100 bg-slate-50/50"
        >
          <div class="flex items-center gap-1.5">
            <Rating
              :stars="1"
              readonly
              :pt="{
                onIcon: { class: 'pi pi-star-fill !text-yellow-400' },
                offIcon: { class: 'pi pi-star-fill !text-yellow-400' },
              }"
            />
            <span class="text-sm font-medium text-slate-700">{{ ratingDisplay }}</span>
          </div>

          <div class="flex items-baseline gap-1">
            <span class="text-xs text-slate-500">Dès</span>
            <span class="font-bold text-[#3525CD]">{{ formattedPrice }} €</span>
          </div>
        </div>
      </template>
    </Card>
  </RouterLink>
</template>
