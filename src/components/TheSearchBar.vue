<script setup lang="ts">
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleSearch() {
  emit('search', props.modelValue ?? '')
}
</script>

<template>
  <div class="flex items-center justify-center md:w-md w-full gap-3">
    <IconField class="flex-1">
      <InputIcon class="pi pi-search" />
      <InputText
        :value="modelValue"
        type="search"
        :placeholder="placeholder ?? 'Rechercher un service (ex: Design, Tutorat, Rédaction...)'"
        class="w-full rounded-lg focus:border-[#3525CD] truncate"
        variant="outlined"
        @input="onInput"
        @keyup.enter="handleSearch"
      />
    </IconField>
    <Button type="button" label="Chercher" class="bg-[#3525CD] w-max" @click="handleSearch" />
  </div>
</template>
