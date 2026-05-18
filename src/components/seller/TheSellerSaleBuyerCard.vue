<script setup lang="ts">
import Button from 'primevue/button'
import type { SellerSummary } from '@/types/service'

defineProps<{
  buyer: SellerSummary
}>()

const emit = defineEmits<{
  contact: []
}>()

function handleContact(): void {
  emit('contact')
}
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      <p class="text-sm text-slate-500 mb-1">Acheteur</p>
      <p class="text-slate-800">
        {{ buyer.first_name }} {{ buyer.last_name }}
        <span v-if="buyer.university" class="text-slate-500"> — {{ buyer.university }} </span>
      </p>
    </div>
    <Button
      label="Contacter l'acheteur"
      icon="pi pi-comments"
      severity="secondary"
      outlined
      size="small"
      @click="handleContact"
    />
  </div>
</template>
