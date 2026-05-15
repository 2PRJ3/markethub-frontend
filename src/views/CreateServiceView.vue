<script setup lang="ts">
import { onUnmounted } from 'vue'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFormUpload from '@/components/forms/TheFormUpload.vue'
import { useServiceStore } from '@/stores/serviceStore'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { storeToRefs } from 'pinia'
import TheServiceDraft from '@/components/services/TheServiceDraft.vue'
import TheFormError from '@/components/forms/TheFormError.vue'

const categories = [
  { label: 'Cours particulier', value: 1 },
  { label: 'Développement', value: 2 },
  { label: 'Design', value: 3 },
  { label: 'Rédaction', value: 4 },
  { label: 'Autre', value: 5 },
]

const serviceStore = useServiceStore()
const router = useRouter()
const toast = useToast()
const { draft, stepErrors, loading } = storeToRefs(serviceStore)

function handleNext(target: string, activateCallback: (val: string) => void) {
  if (serviceStore.goToNextStep()) {
    activateCallback(target)
  }
}

function handlePrevious(target: string, activateCallback: (val: string) => void) {
  serviceStore.goToPreviousStep()
  activateCallback(target)
}

function handleFileSelect(file: File | null) {
  serviceStore.setImage(file)
}

async function handlePublish() {
  try {
    const created = await serviceStore.createService()
    if (created) {
      toast.add({
        severity: 'success',
        summary: 'Service publié',
        detail: 'Votre service est maintenant en ligne',
        life: 3000,
      })
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de publier le service',
      life: 3000,
    })
  }
}
function selectedCategoryLabel(): string {
  return categories.find((c) => c.value === draft.value.category_id)?.label ?? '—'
}

onUnmounted(() => {
  serviceStore.resetDraft()
})
</script>
<template>
  <header>
    <TheNavbar />
  </header>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-center font-bold text-3xl pb-4">Création de service</h1>
    <div class="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <Stepper value="1">
        <StepList>
          <Step value="1">Titre & Catégorie</Step>
          <Step value="2">Description</Step>
          <Step value="3">Récap</Step>
        </StepList>
        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" value="1">
            <div class="flex flex-col">
              <div class="flex flex-col gap-4">
                <div class="flex flex-col">
                  <label for="title">Titre</label>
                  <InputText id="title" v-model="draft.title" />
                  <TheFormError :message="stepErrors.title" />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="categories">Catégorie</label>
                  <SelectButton
                    v-model="draft.category_id"
                    :options="categories"
                    optionLabel="label"
                    optionValue="value"
                    :pt="{
                      root: { class: 'flex flex-wrap gap-2 border-0' },
                      button: ({ context }: any) => ({
                        class: [
                          'px-3 py-2.5 rounded-lg border text-sm transition-colors',
                          context.active
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                        ],
                      }),
                    }"
                  />
                  <TheFormError :message="stepErrors.category_id" />
                </div>

                <div class="flex flex-col">
                  <label for="price">Tarifs</label>
                  <InputNumber
                    id="price"
                    v-model="draft.price"
                    mode="currency"
                    class="w-48"
                    currency="EUR"
                    fluid
                  />
                  <TheFormError :message="stepErrors.price" />
                </div>
              </div>
            </div>
            <div class="flex pt-6 justify-end">
              <Button label="Suivant" @click="handleNext('2', activateCallback)" />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col">
                <label for="description">Description</label>
                <Textarea id="description" v-model="draft.description" rows="6" />
                <small v-if="stepErrors.description" class="text-red-500 mt-1">
                  {{ stepErrors.description }}
                </small>
              </div>
              <TheFormUpload
                labelTitle="Image d'illustration"
                @select="handleFileSelect"
                :maxSize="5000000"
              />
              <TheFormError :message="stepErrors.description" />
            </div>
            <div class="flex pt-6 justify-between">
              <Button label="Précédent" @click="handlePrevious('1', activateCallback)" />
              <Button label="Suivant" @click="handleNext('3', activateCallback)" />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="3">
            <TheServiceDraft :draft="draft" :categories="categories" />

            <div class="flex pt-6 justify-between">
              <Button label="Précédent" @click="handlePrevious('2', activateCallback)" />
              <Button label="Suivant" @click="handlePublish" />
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </div>
</template>
