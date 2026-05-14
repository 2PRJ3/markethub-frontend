<script setup lang="ts">
import FileUpload from 'primevue/fileupload'
defineProps<{
  labelTitle?: string
  maxSize?: number
  idFor?: string
}>()
</script>
<template>
  <div>
    <label :for="idFor">{{ labelTitle }}</label>
    <FileUpload
      mode="advanced"
      accept="image/* "
      :maxFileSize="maxSize"
      :showCancelButton="false"
      :showUploadButton="false"
    >
      <template #empty>
        <span>Glisser et déposer l'image ici pour le téléverser.</span>
      </template>
    </FileUpload>
  </div>
</template>
