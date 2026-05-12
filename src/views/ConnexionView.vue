<script setup lang="ts">
import { useRouter } from 'vue-router'
import TheFormLogin from '@/components/forms/TheFormLogin.vue'

const router = useRouter()

const onLoginSuccess = () => {
  console.log('Login success')
  router.push({ name: 'home' })
}
</script>
<template>
  <div class="flex flex-row w-screen gap-2">
    <div class="flex flex-1 flex-col md:ml-20">
      <span class="text-3xl font-bold text-[#2921A3] pt-5">Markethub</span>
      <div class="pt-12">
        <h2 class="font-bold text-2xl">Se connecter</h2>
        <TheFormLogin @login-success="onLoginSuccess" />
      </div>
    </div>
    <div class="bg-[#4F46E5] hidden w-3xl h-screen md:flex flex-col items-center justify-center">
      <span class="font-extrabold text-white text-4xl">Bon retour !</span>
    </div>
  </div>
</template>
