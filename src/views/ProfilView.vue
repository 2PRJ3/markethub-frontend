<script setup lang="ts">
import { ref, computed } from 'vue'
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
import TheDialog from '@/components/TheDialog.vue'
import TheFormUpdate from '@/components/forms/TheFormUpdate.vue'
import TheFormPassword from '@/components/forms/TheFormPassword.vue'
import TheOrderHistoric from '@/components/orders/TheOrderHistoric.vue'
import TheSellerPanel from '@/components/orders/TheSellerPanel.vue'

const loginStore = useLoginStore()
const { user } = storeToRefs(loginStore)

// const fullName = computed(() =>
//   user.value ? `${user.value.first_name} ${user.value.last_name}` : '',
// )
//
const roleLabel = computed(() => (user.value?.role === 'admin' ? 'Administrateur' : 'Étudiant'))
//
// const avatar = computed(() => user.value?.avatar_url || avatarFallback)
const editVisible = ref(false)
const passwordEditVisible = ref(false)
</script>

<template>
  <header>
    <TheNavbar />
  </header>
  <Tabs value="0">
    <TabList class="flex items-center text-surface-700">
      <Tab value="0" class="text-surface-700">Mon profil</Tab>
      <Tab value="1" class="text-surface-700">Mes services</Tab>
      <Tab value="2" class="text-surface-700">Historique de mes ventes</Tab>
      <Tab value="3" class="text-surface-700">Historiques des commmandes</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <section class="flex flex-col gap-5 m-5">
          <Panel>
            <div class="flex items-center gap-5">
              <div>
                <Avatar :image="avatarImage" shape="circle" size="large" class="flex" />
              </div>
              <div>
                <p>{{ user?.first_name }}</p>
                <p>{{ user?.email }}</p>
                <p>{{ roleLabel }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end">
              <Button label="Changer de mot de passe" @click="passwordEditVisible = true" />
            </div>
            <TheDialog v-model:visible="passwordEditVisible" title="Modifier votre mot de passe">
              <TheFormPassword
                :key="String(passwordEditVisible)"
                @saved="passwordEditVisible = false"
                @cancel="passwordEditVisible = false"
              />
            </TheDialog>
          </Panel>

          <Panel header="Mes informations personnel" toggleable class="">
            <Divider />
            <template #icons>
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                rounded
                text
                @click="editVisible = true"
              />
            </template>
            <TheDialog v-model:visible="editVisible" title="Modifier mon profil">
              <TheFormUpdate
                :key="String(editVisible)"
                @saved="editVisible = false"
                @cancel="editVisible = false"
              />
            </TheDialog>
            <div class="flex flex-col gap-5">
              <div class="flex flex-row justify-around">
                <div class="flex flex-col">
                  <span class="font-semibold">Prénom</span>
                  <span>{{ user?.first_name }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-semibold">Nom</span>
                  <span>{{ user?.last_name.toUpperCase() }}</span>
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
      <TabPanel value="1"> Mes services </TabPanel>
      <TabPanel value="2">
        <TheSellerPanel />
      </TabPanel>
      <TabPanel value="3">
        <TheOrderHistoric />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
