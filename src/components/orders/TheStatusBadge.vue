<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import type { OrderStatus, OrderItemStatus } from '@/types/order'

const props = defineProps<{
  status: OrderStatus | OrderItemStatus
}>()

interface BadgeConfig {
  label: string
  severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
}

const STATUS_CONFIG: Record<string, BadgeConfig> = {
  pending: { label: 'En attente', severity: 'warn' },
  paid: { label: 'Payée', severity: 'info' },
  in_progress: { label: 'En cours', severity: 'info' },
  delivered: { label: 'Livrée', severity: 'info' },
  completed: { label: 'Terminée', severity: 'success' },
  canceled: { label: 'Annulée', severity: 'danger' },
}

const config = computed<BadgeConfig>(
  () =>
    STATUS_CONFIG[props.status] ?? {
      label: props.status,
      severity: 'secondary',
    },
)
</script>

<template>
  <Tag :value="config.label" :severity="config.severity" />
</template>
