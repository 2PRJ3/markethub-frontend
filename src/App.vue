<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <Toast position="top-right"/>
  <RouterView />
</template>
