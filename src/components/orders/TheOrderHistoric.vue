<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { useOrderStore } from '@/stores/orderStore'
import TheStatusBadge from '@/components/orders/TheStatusBadge.vue'
import type { BuyerOrderSummary } from '@/types/order'

const router = useRouter()

const orderStore = useOrderStore()
const { myOrders, loading } = storeToRefs(orderStore)

const fetchError = ref<string | null>(null)

onMounted(async () => {
  try {
    await orderStore.fetchMyOrders({ skip: 0, limit: 20 })
  } catch {
    fetchError.value = 'Impossible de charger vos commandes. Veuillez réessayer.'
  }
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatAmount(amount: string): string {
  const n = Number(amount)
  return Number.isFinite(n) ? `${n.toFixed(2)} €` : `${amount} €`
}

function onRowClick(event: DataTableRowClickEvent): void {
  const order = event.data as BuyerOrderSummary
  router.push({ name: 'my-order-detail', params: { id: order.id } })
}

function resumePayment(order: BuyerOrderSummary, event: Event): void {
  event.stopPropagation()
  router.push({ name: 'order-pay', params: { id: order.id } })
}
</script>

<template>
  <section class="flex flex-col gap-5 m-5">
    <Message v-if="fetchError" severity="error" :closable="false">
      {{ fetchError }}
    </Message>

    <DataTable
      :value="myOrders"
      :loading="loading"
      data-key="id"
      striped-rows
      paginator
      :rows="10"
      row-hover
      class="cursor-pointer"
      @row-click="onRowClick"
    >
      <template #empty>
        <div class="text-center py-8 text-slate-500">Vous n'avez pas encore passé de commande.</div>
      </template>

      <Column field="id" header="N°">
        <template #body="{ data }"> #{{ data.id }} </template>
      </Column>

      <Column field="created_at" header="Date">
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column field="items_count" header="Articles">
        <template #body="{ data }">
          {{ data.items_count }} service{{ data.items_count > 1 ? 's' : '' }}
        </template>
      </Column>

      <Column field="total_amount" header="Montant">
        <template #body="{ data }">
          {{ formatAmount(data.total_amount) }}
        </template>
      </Column>

      <Column field="status" header="Statut">
        <template #body="{ data }">
          <TheStatusBadge :status="data.status" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button
            v-if="data.status === 'pending'"
            label="Reprendre le paiement"
            icon="pi pi-credit-card"
            size="small"
            class="bg-[#3525CD] border-[#3525CD]"
            @click="(e: Event) => resumePayment(data, e)"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>
