<script setup lang="ts">
import FileUpload, { type FileUploadSelectEvent, type FileUploadRemoveEvent } from 'primevue/fileupload'
defineProps<{
  labelTitle?: string
  maxSize?: number
  idFor?: string
}>()

const emit = defineEmits<{
  select: [file: File | null]
}>()

function onSelect(event: FileUploadSelectEvent) {
  const files = event.files as File[]
  const file = files?.[0] ?? null

  emit('select', file)
}
function onRemove(event: FileUploadRemoveEvent) {
  const remaining = event.files as File[]
  emit('select', remaining?.[0] ?? null)
}

function onClear() {
  emit('select', null)
}
</script>
<template>
  <div>
    <label :for="idFor">{{ labelTitle }}</label>
    <FileUpload
      mode="advanced"
      accept="image/* "
      :fileLimit="1"
      :maxFileSize="maxSize"
      :showCancelButton="false"
      :showUploadButton="false"
      @select="onSelect"
      @remove="onRemove"
      @clear="onClear"
    >
      <template #empty>
        <span>Glisser et déposer l'image ici pour le téléverser.</span>
      </template>
    </FileUpload>
  </div>
</template>
