<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceDraft } from '@/types/service'

interface CategoryOption {
  label: string
  value: number
}

const props = defineProps<{
  draft: ServiceDraft
  categories: CategoryOption[]
}>()

const selectedCategoryLabel = computed(
  () => props.categories.find((c) => c.value === props.draft.category_id)?.label ?? '—',
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="draft.image_preview" class="flex justify-center">
      <img
        :src="draft.image_preview"
        alt="Aperçu"
        class="max-h-48 rounded-lg border border-slate-200"
      />
    </div>

    <div class="grid grid-cols-1 gap-3 bg-slate-50 rounded-lg p-4">
      <div>
        <span class="text-sm text-slate-500">Titre</span>
        <p class="font-medium">{{ draft.title }}</p>
      </div>
      <div>
        <span class="text-sm text-slate-500">Catégorie</span>
        <p class="font-medium">{{ selectedCategoryLabel }}</p>
      </div>
      <div>
        <span class="text-sm text-slate-500">Prix</span>
        <p class="font-medium">{{ draft.price }} €</p>
      </div>
      <div>
        <span class="text-sm text-slate-500">Description</span>
        <p class="whitespace-pre-wrap">{{ draft.description }}</p>
      </div>
    </div>
  </div>
</template>
