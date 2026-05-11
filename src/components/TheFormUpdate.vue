<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { useLoginStore } from '@/stores/loginStore'
import { useUpdateUserStore } from '@/stores/updateUserStore'
import type { UserUpdatePayload } from '@/types/auth'

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const loginStore = useLoginStore()
const updateUserStore = useUpdateUserStore()

const toast = useToast()
if (!loginStore.user) {
  throw new Error('EditProfileForm requires an authenticated user')
}
const form = ref<UserUpdatePayload>({
  first_name: loginStore.user.first_name,
  last_name: loginStore.user.last_name,
  university: loginStore.user.university,
  study_sector: loginStore.user.study_sector,
  bio: loginStore.user.bio,
})

const errorMessage = ref<string | null>(null)

const errors = computed(() => {
  const e: Record<string, string> = {}

  if (!form.value.first_name?.trim()) {
    e.first_name = 'Le prénom est requis'
  } else if (form.value.first_name.length > 50) {
    e.first_name = 'Maximum 50 caractères'
  }

  if (!form.value.last_name?.trim()) {
    e.last_name = 'Le nom est requis'
  } else if (form.value.last_name.length > 50) {
    e.last_name = 'Maximum 50 caractères'
  }

  if (form.value.university && form.value.university.length > 100) {
    e.university = 'Maximum 100 caractères'
  }

  if (form.value.bio && form.value.bio.length > 500) {
    e.bio = 'Maximum 500 caractères'
  }

  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

const cleanPayload = computed((): UserUpdatePayload => {
  const original = loginStore.user!
  const payload: UserUpdatePayload = {}

  const firstNameTrim = form.value.first_name?.trim()
  const lastNameTrim = form.value.last_name?.trim()
  const universityTrim = form.value.university?.trim()
  const studySectorTrim = form.value.study_sector?.trim()
  const bioTrim = form.value.bio?.trim()

  if (firstNameTrim !== original.first_name) {
    payload.first_name = firstNameTrim
  }
  if (lastNameTrim !== original.last_name) {
    payload.last_name = lastNameTrim
  }
  if (universityTrim !== original.university) {
    payload.university = universityTrim
  }
  if (studySectorTrim !== original.study_sector) {
    payload.study_sector = studySectorTrim
  }
  if (bioTrim !== original.bio) {
    payload.bio = bioTrim
  }
  return payload
})
const hasChanges = computed(() => Object.keys(cleanPayload.value).length > 0)

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
async function handleSubmit() {
  if (!isValid.value || !hasChanges.value) return

  errorMessage.value = null

  try {
    await updateUserStore.updateProfile(cleanPayload.value)
    toast.add({severity: 'success', summary:'Profil mis à jour', detail:'Vos informations ont bien été enregistrées', life:3000})
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
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <Message v-if="errorMessage" severity="error" :closable="false">
      {{ errorMessage }}
    </Message>
    <div class="flex flex-col gap-1">
      <label for="first_name">Prénom</label>
      <InputText id="first_name" v-model="form.first_name" :invalid="!!errors.first_name" />
      <small v-if="errors.first_name" class="text-red-500">
        {{ errors.first_name }}
      </small>
    </div>

    <div class="flex flex-col gap-1">
      <label for="last_name">Nom</label>
      <InputText id="last_name" v-model="form.last_name" :invalid="!!errors.last_name" />
      <small v-if="errors.last_name" class="text-red-500">
        {{ errors.last_name }}
      </small>
    </div>

    <div class="flex flex-col gap-1">
      <label for="university">Université</label>
      <InputText
        id="university"
        autocomplete="given-name"
        v-model="form.university"
        :invalid="!!errors.university"
      />
      <small v-if="errors.university" class="text-red-500">
        {{ errors.university }}
      </small>
    </div>

    <div class="flex flex-col gap-1">
      <label for="study_sector">Filière</label>
      <InputText id="study_sector" autocomplete="given-name" v-model="form.study_sector" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="bio">Bio</label>
      <Textarea
        id="bio"
        rows="4"
        v-model="form.bio"
        :invalid="!!errors.bio"
        auto-resize
        placeholder="Présente-toi en quelques mots..."
      />
      <small :class="errors.bio ? 'text-red-500' : 'text-gray-500'" class="text-right">
        {{ form.bio?.length || 0 }} / 500
      </small>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="button" label="Annuler" severity="secondary" @click="handleCancel" />
      <Button type="submit" label="Enregistrer" />
    </div>
  </form>
</template>
