<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Paginator, { type PageState } from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'
import TheNavbar from '@/components/TheNavbar.vue'
import TheSearchBar from '@/components/TheSearchBar.vue'
import TheFilterSidebar from '@/components/TheFilterSidebar.vue'
import TheCard from '@/components/TheCard.vue'
import { useServiceStore } from '@/stores/serviceStore'
import { useServiceSearch } from '@/composables/useServiceSearch'

const serviceStore = useServiceStore()
const { services, loading, pagination } = storeToRefs(serviceStore)

const { searchInput, selectedCategoryId, setQuery, setCategoryId, setPage } = useServiceSearch()

function handlePageChange(event: PageState) {
  setPage(event.page + 1)
}
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Catalogue de services</h1>
      <p class="text-slate-600">Trouve le service qui correspond à tes besoins</p>
    </div>

    <div class="mb-8">
      <TheSearchBar :model-value="searchInput" @update:model-value="setQuery" @search="setQuery" />
    </div>

    <div class="flex gap-6">
      <TheFilterSidebar :model-value="selectedCategoryId" @update:model-value="setCategoryId" />

      <main class="flex-1 min-w-0">
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-slate-600">
            <span v-if="loading && services.length === 0">Chargement...</span>
            <span v-else>
              {{ pagination.total }} service{{ pagination.total > 1 ? 's' : '' }} trouvé{{
                pagination.total > 1 ? 's' : ''
              }}
            </span>
          </p>
        </div>

        <div
          v-if="loading && services.length === 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Skeleton v-for="n in 6" :key="n" height="20rem" class="rounded-xl" />
        </div>

        <Message v-else-if="!loading && services.length === 0" severity="info" :closable="false">
          Aucun service ne correspond à ta recherche.
        </Message>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TheCard v-for="service in services" :key="service.id" :service="service" />
        </div>

        <Paginator
          v-if="pagination.total > pagination.page_size"
          :rows="pagination.page_size"
          :totalRecords="pagination.total"
          :first="(pagination.page - 1) * pagination.page_size"
          class="mt-8"
          :pt="{
            page: ({ context }: any) => ({
              class: [
                'min-w-10 h-10 mx-1 rounded-full transition-colors',
                context.active
                  ? '!bg-[#3525CD] !text-white hover:!bg-[#2a1da8]'
                  : 'bg-transparent text-slate-700 hover:bg-slate-100',
              ],
            }),
          }"
          @page="handlePageChange"
        />
      </main>
    </div>
  </div>
</template>
