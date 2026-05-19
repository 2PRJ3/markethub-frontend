<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import { useCategoriesStore } from '@/stores/categoriesStore'

defineProps<{
  modelValue: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

onMounted(() => {
  categoriesStore.fetchCategories()
})

function resetFilter() {
  emit('update:modelValue', null)
}
</script>

<template>
  <aside class="w-64 shrink-0">
    <div class="sticky top-4 border border-slate-200 rounded-xl p-5 bg-white">
      <h2 class="font-semibold text-slate-900 mb-4">Catégories</h2>

      <ul class="flex flex-col gap-3">
        <li v-for="category in categories" :key="category.id" class="flex items-center gap-2">
          <RadioButton
            :inputId="`cat-${category.id}`"
            :value="category.id"
            :modelValue="modelValue"
            name="category"
            @update:modelValue="emit('update:modelValue', $event)"
          />
          <label
            :for="`cat-${category.id}`"
            class="text-sm text-slate-700 cursor-pointer select-none"
          >
            {{ category.name }}
          </label>
        </li>
      </ul>

      <Button
        v-if="modelValue !== null"
        label="Réinitialiser"
        severity="secondary"
        text
        size="small"
        icon="pi pi-times"
        class="mt-4 w-full"
        @click="resetFilter"
      />
    </div>
  </aside>
</template>
