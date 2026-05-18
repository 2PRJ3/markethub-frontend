<script setup lang="ts">
import { ref, computed } from 'vue'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'

const props = defineProps<{
  disabled?: boolean
  submitting?: boolean
  submitError?: string | null
}>()

const emit = defineEmits<{
  submit: [brief: string]
  cancel: []
}>()

const form = ref<{ brief: string }>({
  brief: '',
})

const errors = computed(() => {
  const e: Record<string, string> = {}
  const trimmed = form.value.brief.trim()

  if (!trimmed) {
    e.brief = 'Le brief est requis'
  } else if (trimmed.length < 20) {
    e.brief = `Minimum ${20} caractères (${20 - trimmed.length} restants)`
  } else if (trimmed.length > 2000) {
    e.brief = `Maximum ${2000} caractères`
  }

  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function handleSubmit(): void {
  if (!isValid.value || props.disabled || props.submitting) return
  emit('submit', form.value.brief.trim())
}

function handleCancel(): void {
  emit('cancel')
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <Message v-if="submitError" severity="error" :closable="false">
      {{ submitError }}
    </Message>

    <div class="flex flex-col gap-1">
      <label for="brief">Votre brief</label>
      <Textarea
        id="brief"
        v-model="form.brief"
        rows="10"
        :maxlength="2000"
        :invalid="!!errors.brief"
        :disabled="disabled"
        auto-resize
        placeholder="Décrivez votre projet, les livrables attendus, les délais, les contraintes…"
      />
      <div class="flex justify-between items-center">
        <small v-if="errors.brief" class="text-red-500">
          {{ errors.brief }}
        </small>
        <span v-else></span>
        <small :class="errors.brief ? 'text-red-500' : 'text-gray-500'" class="text-right">
          {{ form.brief.length }} / {{ 2000 }}
        </small>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        label="Annuler"
        severity="secondary"
        :disabled="submitting"
        @click="handleCancel"
      />
      <Button
        type="submit"
        label="Valider et procéder au paiement"
        icon="pi pi-arrow-right"
        class="bg-[#3525CD] border-[#3525CD]"
        icon-pos="right"
        :disabled="!isValid || disabled"
        :loading="submitting"
      />
    </div>
  </form>
</template>
