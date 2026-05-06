<script setup lang="ts">
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
</script>
<template>
  <div class="flex items-center justify-center md:w-md w-full gap-3">
    <IconField class="flex-1">
      <InputIcon class="pi pi-search" />
      <InputText
        type="search"
        placeholder="Rechercher un service (ex: Design, Tutorat, Rédaction...)"
        class="w-full rounded-lg focus:border-[#3525CD] truncate"
        variant="outlined"
      />
    </IconField>
    <Button type="button" label="Chercher" class="bg-[#3525CD] w-max" />
  </div>
</template>
