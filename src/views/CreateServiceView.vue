<script setup lang="ts">
import { ref } from 'vue'
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

const categories = ref(['Cours particulier', 'Développement', 'Design', 'Rédaction', 'Autre'])
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
                  <InputText />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="categories">Catégorie</label>
                  <SelectButton
                    :options="categories"
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
                </div>

                <div class="flex flex-col">
                  <label for="price">Tarifs</label>
                  <InputNumber id="price" mode="currency" class="w-48" currency="EUR" fluid />
                </div>
              </div>
            </div>
            <div class="flex pt-6 justify-end">
              <Button label="Suivant" @click="activateCallback('2')" />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col">
                <label for="description">Description</label>
                <Textarea id="description" rows="6" />
              </div>
              <TheFormUpload labelTitle="Image d'illustration" :maxSize="5000000" />
            </div>
            <div class="flex pt-6 justify-between">
              <Button label="Précédent" @click="activateCallback('1')" />
              <Button label="Suivant" @click="activateCallback('3')" />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="3">
            <div class="flex flex-col h-48">Contenu 3</div>
            <div>
              <Button label="Précédent" @click="activateCallback('2')" />
              <!--<Button label="Suivant" @click="activateCallback('3')" />-->
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </div>
</template>
