<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import type { OrderItemStatus } from '@/types/order'

const props = defineProps<{
  status: OrderItemStatus
  updating?: boolean
}>()

const emit = defineEmits<{
  advance: [nextStatus: OrderItemStatus]
}>()

const nextAction = computed<{
  label: string
  nextStatus: OrderItemStatus
  icon: string
  description: string
} | null>(() => {
  if (props.status === 'pending') {
    return {
      label: 'Commencer le travail',
      nextStatus: 'in_progress',
      icon: 'pi pi-play',
      description: "L'acheteur attend que vous commenciez le travail.",
    }
  }
  if (props.status === 'in_progress') {
    return {
      label: 'Marquer comme livré',
      nextStatus: 'delivered',
      icon: 'pi pi-check',
      description: 'Une fois le travail terminé, marquez la vente comme livrée.',
    }
  }
  return null
})

function handleAdvance(): void {
  if (!nextAction.value) return
  emit('advance', nextAction.value.nextStatus)
}
</script>

<template>
  <Message v-if="nextAction" severity="info" :closable="false">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span>{{ nextAction.description }}</span>
      <Button
        :label="nextAction.label"
        :icon="nextAction.icon"
        size="small"
        class="bg-[#3525CD] border-[#3525CD]"
        :loading="updating"
        @click="handleAdvance"
      />
    </div>
  </Message>

  <Message v-else-if="status === 'delivered'" severity="warn" :closable="false">
    Le travail a été livré. En attente de confirmation de l'acheteur.
  </Message>

  <Message v-else-if="status === 'completed'" severity="success" :closable="false">
    Cette vente est terminée. L'acheteur a confirmé la livraison.
  </Message>

  <Message v-else-if="status === 'canceled'" severity="error" :closable="false">
    Cette vente a été annulée.
  </Message>
</template>
