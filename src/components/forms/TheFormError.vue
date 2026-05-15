<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <small v-if="message" class="text-red-500 mt-1">
    {{ message }}
  </small>
</template>
