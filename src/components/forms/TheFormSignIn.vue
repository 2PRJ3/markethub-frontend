<script setup lang="ts">
import { ref } from 'vue'
import { useSignInStore } from '@/stores/signInStore'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { SignInValidationError } from '@/types/validation.js'

const signInStore = useSignInStore()
const first_name = ref<string>('')
const last_name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const errorLocal = ref<string | null>(null)

const emit = defineEmits(['signIn-success'])

const handleSubmit = async () => {
  errorLocal.value = null

  try {
    await signInStore.handleSignIn(first_name.value, last_name.value, email.value, password.value)
    emit('signIn-success')
  } catch (error) {
    if (!(error instanceof SignInValidationError)) {
      console.error(error)
    }
  }
}
const clearFieldError = (field: string) => {
  signInStore.errors = signInStore.errors.filter((e) => e.field !== field)
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-10 w-max pt-10">
      <Message v-if="signInStore.getErrorForField('global')" severity="error" :closable="false">
        {{ signInStore.getErrorForField('global') }}
      </Message>
      <!--  Firstname and Lastname-->
      <div class="flex flex-row gap-5">
        <div class="flex flex-col gap-2">
          <label for="firstname" class="font-semibold">Prénom</label>
          <InputText
            v-model="first_name"
            id="firstname"
            aria-describedby="firstname-error"
            :invalid="!!signInStore.getErrorForField('first_name')"
            class="focus:border-[#3525CD]"
            @input="clearFieldError('first_name')"
          />
          <small
            v-if="signInStore.getErrorForField('first_name')"
            id="firstname-error"
            class="text-red-500"
          >
            {{ signInStore.getErrorForField('first_name') }}
          </small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="lastname" class="font-semibold">Nom</label>
          <InputText
            v-model="last_name"
            id="lastname"
            aria-describedby="lastname_error"
            :invalid="!!signInStore.getErrorForField('last_name')"
            class="focus:border-[#3525CD]"
            @input="clearFieldError('last_name')"
          />
          <small
            v-if="signInStore.getErrorForField('last_name')"
            id="lastname-error"
            class="text-red-500"
          >
            {{ signInStore.getErrorForField('last_name') }}
          </small>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="font-semibold">Email</label>
        <InputText
          v-model="email"
          id="email"
          aria-describedby="email-error"
          :invalid="!!signInStore.getErrorForField('email')"
          fluid
          class="focus:border-[#3525CD]"
          @input="clearFieldError('email')"
        />
        <small v-if="signInStore.getErrorForField('email')" id="email-error" class="text-red-500">
          {{ signInStore.getErrorForField('email') }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-semibold">Mot de passe</label>
        <Password
          v-model="password"
          toggleMask
          class="focus:border-[#3525CD]"
          fluid
          :feedback="false"
          :invalid="!!signInStore.getErrorForField('password')"
          @input="clearFieldError('password')"
        />
        <ul
          v-if="signInStore.errors.some((e) => e.field === 'password')"
          class="text-red-500 text-sm list-disc list-inside"
        >
          <li
            v-for="err in signInStore.errors.filter((e) => e.field === 'password')"
            :key="err.message"
          >
            {{ err.message }}
          </li>
        </ul>
        <!-- Indication d'aide quand pas d'erreur -->
        <small v-else class="text-gray-500">
          8 caractères min, avec majuscule, minuscule, chiffre et caractère spécial (@$!%*?&)
        </small>
      </div>

      <Button
        label="S'inscrire"
        class="bg-[#4F46E5]"
        type="submit"
        :disabled="signInStore.loading"
      />
    </div>
  </form>
</template>
