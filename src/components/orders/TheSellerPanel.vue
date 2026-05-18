<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { useOrderStore } from '@/stores/orderStore'
import TheStatusBadge from '@/components/orders/TheStatusBadge.vue'
import type { SellerSaleSummary } from '@/types/order'

const router = useRouter()

const orderStore = useOrderStore()
const { mySales, loading } = storeToRefs(orderStore)

const fetchError = ref<string | null>(null)

onMounted(async () => {
  try {
    await orderStore.fetchMySales({ skip: 0, limit: 50 })
  } catch {
    fetchError.value = 'Impossible de charger vos ventes. Veuillez réessayer.'
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

function viewSale(sale: SellerSaleSummary): void {
  router.push({ name: 'my-sale-detail', params: { itemId: sale.id } })
}
</script>

<template>
  <section class="flex flex-col gap-5 m-5">
    <Message v-if="fetchError" severity="error" :closable="false">
      {{ fetchError }}
    </Message>

    <DataTable
      :value="mySales"
      :loading="loading"
      data-key="id"
      striped-rows
      paginator
      :rows="10"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #empty>
        <div class="text-center py-8 text-slate-500">Vous n'avez pas encore reçu de commande.</div>
      </template>

      <Column field="id" header="N°">
        <template #body="{ data }">#{{ data.id }}</template>
      </Column>

      <Column field="created_at" header="Date">
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column header="Service">
        <template #body="{ data }">
          <span class="line-clamp-1">{{ data.service.title }}</span>
        </template>
      </Column>

      <Column header="Acheteur">
        <template #body="{ data }">
          {{ data.order.buyer.first_name }} {{ data.order.buyer.last_name }}
        </template>
      </Column>

      <Column field="unit_price" header="Montant">
        <template #body="{ data }">
          {{ formatAmount(data.unit_price) }}
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
            label="Voir"
            icon="pi pi-eye"
            size="small"
            severity="secondary"
            outlined
            @click="viewSale(data)"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>
