<script setup lang="ts">
import Dialog from 'primevue/dialog'

const visible = defineModel<boolean>('visible', { default: false })

withDefaults(
  defineProps<{
    title?: string
    width?: string
    closable?: boolean
    closeOnEscape?: boolean
  }>(),
  {
    width: '500px',
    closable: true,
    closeOnEscape: true,
  },
)
</script>
<template>
  <Dialog
    v-model:visible="visible"
    :header="title"
    :closable="closable"
    :close-on-escape="closeOnEscape"
    modal
    :style="{ width }"
  >
    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" :close="() => false" />
    </template>
  </Dialog>
</template>
