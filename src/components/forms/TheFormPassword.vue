<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import Password from 'primevue/password'
import Button from 'primevue/button'
import { validatePassword } from '@/validators/authValidation'
import type { ValidationError } from '@/types/validation'
import { useUpdateUserStore } from '@/stores/updateUserStore'
import { useToast } from 'primevue/usetoast'
import type { PasswordUpdatePayload } from '@/types/auth'

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const updateUserStore = useUpdateUserStore()
const toast = useToast()

const form = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

const errorMessage = ref<string | null>(null)
const submit = ref(false)

const validationErrors = computed<ValidationError[]>(() => {
  const errors: ValidationError[] = []

  if (!form.value.current_password) {
    errors.push({
      field: 'current_password',
      message: 'Veuillez rentrer votre mot de passe actuel',
    })
  }
  errors.push(
    ...validatePassword(form.value.new_password).map((e) => ({ ...e, field: 'new_password' })),
  )

  if (
    form.value.new_password &&
    form.value.current_password &&
    form.value.new_password === form.value.current_password
  ) {
    errors.push({
      field: 'confirm_password',
      message: "Votre nouveau mot de passe doit être différent de l'ancien",
    })
  }
  if (!form.value.confirm_password) {
    errors.push({ field: 'confirm_password', message: 'La confirmation est requise' })
  } else if (form.value.new_password !== form.value.confirm_password) {
    errors.push({ field: 'confirm_password', message: 'Les mots de passe ne correspondent pas' })
  }
  return errors
})

const isValid = computed(() => validationErrors.value.length === 0)
watch(
  form,
  () => {
    if (errorMessage.value) {
      errorMessage.value = null
      updateUserStore.cleanError()
    }
  },
  { deep: true },
)
function showFieldError(field: string): string | null {
  if (!submit.value) return null
  const fieldError = validationErrors.value.find((e) => e.field === field)
  return fieldError?.message ?? null
}
async function handleSubmit() {
  submit.value = true

  if (!isValid.value) return

  errorMessage.value = null
  const payload: PasswordUpdatePayload = {
    current_password: form.value.current_password,
    new_password: form.value.new_password,
  }
  try {
    await updateUserStore.updatePassword(payload)

    toast.add({
      severity: 'success',
      summary: 'Mot de passe modifié',
      detail: 'Ton mot de passe a bien été mis à jour.',
      life: 3000,
    })

    emit('saved')
  } catch {
    errorMessage.value = updateUserStore.error
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <Message v-if="errorMessage" severity="error" :closable="false">
      {{ errorMessage }}
    </Message>
    <div>
      <label for="current_password">Ancien mot de passe</label>
      <Password
        v-model="form.current_password"
        :invalid="!!showFieldError('current_password')"
        toggleMask
        fluid
        :feedback="false"
      />
      <small v-if="showFieldError('current_password')" class="text-red-500">
        {{ showFieldError('current_password') }}
      </small>
    </div>
    <div>
      <label for="new_password">Nouveau mot de passe</label>
      <Password
        v-model="form.new_password"
        :invalid="!!showFieldError('new_password')"
        toggleMask
        fluid
        :feedback="false"
      />
      <small v-if="showFieldError('new_password')" class="text-red-500">
        {{ showFieldError('new_password') }}
      </small>
    </div>
    <div>
      <label for="confirm_password">Confirmez votre mot de passe</label>
      <Password
        v-model="form.confirm_password"
        :invalid="!!showFieldError('confirm_password')"
        toggleMask
        fluid
        :feedback="false"
      />
      <small v-if="showFieldError('confirm_password')" class="text-red-500">
        {{ showFieldError('confirm_password') }}
      </small>
    </div>
    <div class="flex justify-end gap-2 pt-2">
      <Button type="button" label="Annuler" severity="secondary" @click="handleCancel" />
      <Button type="submit" label="Enregistrer" />
    </div>
  </form>
</template>
