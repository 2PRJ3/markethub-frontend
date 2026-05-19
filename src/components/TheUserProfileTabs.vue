<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Paginator, { type PageState } from 'primevue/paginator'
import TheCard from '@/components/TheCard.vue'
import type { UserPublic } from '@/types/user'
import type { ServiceSummary } from '@/types/service'

interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

defineProps<{
  user: UserPublic
  services: ServiceSummary[]
  pagination: Pagination
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

function onPageChange(event: PageState): void {
  emit('page-change', event.page + 1)
}
</script>

<template>
  <section class="px-6 mt-8">
    <Tabs value="0">
      <TabList>
        <Tab value="0" class="text-surface-700">Services</Tab>
        <Tab value="1" class="text-surface-700">À propos</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <div v-if="services.length === 0" class="py-12 text-center text-slate-500">
            Cet utilisateur ne propose pas encore de services.
          </div>

          <template v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              <TheCard v-for="service in services" :key="service.id" :service="service" />
            </div>

            <Paginator
              v-if="pagination.total_pages > 1"
              :first="(pagination.page - 1) * pagination.page_size"
              :rows="pagination.page_size"
              :total-records="pagination.total"
              :template="'PrevPageLink PageLinks NextPageLink'"
              class="mt-4 bg-transparent border-0"
              @page="onPageChange"
            />
          </template>
        </TabPanel>

        <TabPanel value="1">
          <div class="py-4 max-w-3xl">
            <p v-if="user.bio" class="text-slate-700 whitespace-pre-line leading-relaxed">
              {{ user.bio }}
            </p>
            <p v-else class="text-slate-500 italic">
              Cet utilisateur n'a pas encore rédigé de bio.
            </p>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>
