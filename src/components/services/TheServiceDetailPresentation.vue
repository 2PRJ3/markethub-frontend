<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import imagedefault from '@/assets/pictures/background.png'
import type { ServiceRead } from '@/types/service'

const props = defineProps<{
  service: ServiceRead
}>()

const publishedDate = computed(() => {
  if (!props.service.created_at) return ''
  return new Date(props.service.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">
        {{ props.service.title }}
      </h1>
      <div class="flex items-center gap-3">
        <Tag
          v-if="props.service.category"
          :value="props.service.category.name"
          class="bg-blue-50 text-[#3525CD] font-medium"
        />
        <span v-if="props.service.category" class="text-sm text-slate-500">•</span>
        <span class="text-sm text-slate-500">Publié le {{ publishedDate }}</span>
      </div>
    </div>

    <div class="rounded-2xl overflow-hidden border border-slate-200 mb-8">
      <img
        :src="props.service.image_url || imagedefault"
        :alt="props.service.title"
        class="w-full h-96 object-cover"
      />
    </div>

    <section class="mb-8">
      <h2 class="text-xl font-bold text-slate-900 mb-4">À propos de ce service</h2>
      <p class="text-slate-700 whitespace-pre-wrap leading-relaxed">
        {{ props.service.description }}
      </p>
    </section>
  </div>
</template>
