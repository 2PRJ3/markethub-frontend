<script setup lang="ts">
import { ref } from 'vue'
import { useLoginStore } from '@/stores/loginStore'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const loginStore = useLoginStore()

const email = ref<string>('')
const password = ref<string>('')
const errorLocal = ref<string | null>(null)

const emit = defineEmits(['login-success'])

const handleSubmit = async () => {
  errorLocal.value = null

  try {
    await loginStore.handleLogin(email.value, password.value)
    emit('login-success')
  } catch (error: any) {
    errorLocal.value = error.message || 'Erreur de connexion'
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-col w-screen md:w-96 gap-6 pt-10">
      <div class="flex flex-col gap-2">
        <label for="email" class="font-semibold">Email</label>
        <InputText
          v-model="email"
          id="email"
          aria-describedby="email-help"
          class="focus:border-[#3525CD]"
        />
      </div>

      <div class="flex flex-col gap-2 w-96">
        <label for="password" class="font-semibold">Mot de passe</label>
        <Password
          v-model="password"
          toggleMask
          class="w-96 focus:border-0"
          fluid
          :feedback="false"
        />
      </div>

      <Button
        label="Se connecter"
        class="bg-[#4F46E5]"
        type="submit"
        :disabled="loginStore.loading"
      />

      <div class="text-center">
        <span>Pas encore de compte ? </span>
        <router-link to="/">
          <span class="text-[#4F46E5]">S'inscrire</span>
        </router-link>
      </div>
    </div>
  </form>
</template>
