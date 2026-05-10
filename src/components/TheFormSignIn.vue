<script setup lang="ts">
import { ref } from 'vue'
import { useSignInStore } from '@/stores/signInStore'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const signInStore = useSignInStore()
const first_name = ref<string>('')
const last_name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const errorLocal = ref<string | null>(null)

const emit = defineEmits(['signIn-success'])

const handleSubmit = async () => {
  errorLocal.value = null

  try{
    await signInStore.handleSignIn(first_name.value, last_name.value, email.value, password.value)
    emit('signIn-success')
  }catch (error: any){
    errorLocal.value = error.message || "Erreur lors de l'inscription"
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-10 w-max pt-10">
      <!--  Firstname and Lastname-->
      <div class="flex flex-row gap-5">
        <div class="flex flex-col gap-2">
          <label for="firstname" class="font-semibold">Prénom</label>
          <InputText
            v-model="first_name"
            id="firstname"
            aria-describedby="firstname-help"
            class="focus:border-[#3525CD]"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="lastname" class="font-semibold">Nom</label>
          <InputText
            v-model="last_name"
            id="lastname"
            aria-describedby="firstname-help"
            class="focus:border-[#3525CD]"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="font-semibold">Email</label>
        <InputText v-model="email" id="email" aria-describedby="email-help" fluid class="focus:border-[#3525CD]" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-semibold">Mot de passe</label>
        <Password v-model="password" toggleMask class="focus:border-[#3525CD]" fluid :feedback="false" />
      </div>

      <Button label="S'inscrire" class="bg-[#4F46E5]" type="submit"  :disabled="signInStore.loading"/>
    </div>
  </form>
</template>
