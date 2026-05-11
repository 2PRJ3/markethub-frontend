<script setup lang="ts">
import { computed } from 'vue'
import Panel from 'primevue/panel'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import TheNavbar from '@/components/TheNavbar.vue'
import avatarImage from '@/assets/pictures/avatar.png'

import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/loginStore'

const loginStore = useLoginStore()
const { user } = storeToRefs(loginStore)

// const fullName = computed(() =>
//   user.value ? `${user.value.first_name} ${user.value.last_name}` : '',
// )
//
const roleLabel = computed(() => (user.value?.role === 'admin' ? 'Administrateur' : 'Étudiant'))
//
// const avatar = computed(() => user.value?.avatar_url || avatarFallback)
</script>

<template>
  <header>
    <TheNavbar />
  </header>
  <Tabs value="0">
    <TabList class="flex items-center">
      <Tab value="0">Mon profil</Tab>
      <Tab value="1">Mes services</Tab>
      <Tab value="2">Historiques des services</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <section class="flex flex-col gap-5 m-5">
          <Panel>
            <div class="flex gap-5">
              <div>
                <Avatar :image="avatarImage" shape="circle" size="large" class="flex" />
              </div>
              <div>
                <p>{{ user?.first_name }}</p>
                <p>{{ user?.email }}</p>
                <p>{{ roleLabel }}</p>
              </div>
            </div>
          </Panel>

          <Panel header="Mes informations personnel" toggleable class="">
            <Divider />
            <template #icons>
              <Button icon="pi pi-pencil" severity="secondary" rounded text />
            </template>
            <div class="flex flex-col gap-5">
              <div class="flex flex-row justify-around">
                <div class="flex flex-col">
                  <span class="font-semibold">Prénom</span>
                  <span>{{ user?.first_name }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">Nom</span>
                  <span>{{ user?.last_name }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">Université</span>
                  <span>{{ user?.university ?? '-' }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">Filière</span>
                  <span>{{ user?.study_sector ?? '-' }}</span>
                </div>
              </div>
              <div>
                <span class="font-semibold">Biographie</span>
                <p class="m-0">
                  {{ user?.bio ?? 'Aucune biographie renseignée.' }}
                </p>
              </div>
            </div>
          </Panel>
        </section>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
