<script setup lang="ts">
import { useRouter } from 'vue-router'
import TheFormSignIn from '@/components/forms/TheFormSignIn.vue'

const router = useRouter()

const onSignSuccess = () => {
  router.push({name: 'login'})
}
</script>
<template>
  <div class="flex flex-row w-screen gap-2">
    <div class="flex flex-1 flex-col md:ml-20">
      <span class="text-3xl font-bold text-[#2921A3] pt-5">Markethub</span>
      <div class="pt-12">
        <h2 class="font-bold text-2xl">Créer votre compte</h2>
        <TheFormSignIn @sign-in-success="onSignSuccess" />
      </div>
    </div>
    <div class="bg-[#4F46E5] hidden w-3xl h-screen md:flex flex-col items-center justify-center">
      <span class="font-extrabold text-white text-2xl leading-tight">Rejoins d'autres étudiants comme toi afin de s'entraider </span>
    </div>
  </div>
</template>
