<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Button from 'primevue/button'
import Message from 'primevue/message'
import {
  validateCardNumber,
  validateCardHolder,
  validateExpiry,
  validateCvv,
  formatExpiryForApi,
  stripCardNumber,
} from '@/validators/payment'
import type { PaymentPayload } from '@/types/order'

const props = defineProps<{
  submitting?: boolean
  submitError?: string | null
}>()

const emit = defineEmits<{
  submit: [payment: PaymentPayload]
  cancel: []
  'clear-error': []
}>()

const form = ref({
  card_number: '',
  card_holder: '',
  expiry: '',
  cvv: '',
})

const errors = computed(() => {
  const e: Record<string, string> = {}

  const cardNumberError = validateCardNumber(form.value.card_number)
  if (cardNumberError) e.card_number = cardNumberError

  const cardHolderError = validateCardHolder(form.value.card_holder)
  if (cardHolderError) e.card_holder = cardHolderError

  const expiryError = validateExpiry(form.value.expiry)
  if (expiryError) e.expiry = expiryError

  const cvvError = validateCvv(form.value.cvv)
  if (cvvError) e.cvv = cvvError

  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)
const touched = ref({
  card_number: false,
  card_holder: false,
  expiry: false,
  cvv: false,
})

function markTouched(field: keyof typeof touched.value): void {
  touched.value[field] = true
}

const visibleErrors = computed(() => {
  const v: Record<string, string> = {}
  for (const [field, message] of Object.entries(errors.value)) {
    if (touched.value[field as keyof typeof touched.value]) {
      v[field] = message
    }
  }
  return v
})

watch(
  form,
  () => {
    if (props.submitError) {
      emit('clear-error')
    }
  },
  { deep: true },
)

function handleSubmit(): void {
  touched.value = {
    card_number: true,
    card_holder: true,
    expiry: true,
    cvv: true,
  }

  if (!isValid.value || props.submitting) return

  emit('submit', {
    card_number: stripCardNumber(form.value.card_number),
    card_holder: form.value.card_holder.trim(),
    expiry: formatExpiryForApi(form.value.expiry),
    cvv: form.value.cvv,
  })
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
      <label for="card_number">Numéro de carte</label>
      <InputMask
        id="card_number"
        v-model="form.card_number"
        mask="9999 9999 9999 9999"
        placeholder="4242 4242 4242 4242"
        :invalid="!!visibleErrors.card_number"
        autocomplete="cc-number"
        inputmode="numeric"
        @blur="markTouched('card_number')"
      />
      <small v-if="visibleErrors.card_number" class="text-red-500">
        {{ visibleErrors.card_number }}
      </small>
    </div>

    <div class="flex flex-col gap-1">
      <label for="card_holder">Titulaire de la carte</label>
      <InputText
        id="card_holder"
        v-model="form.card_holder"
        placeholder="Prénom Nom"
        :invalid="!!visibleErrors.card_holder"
        autocomplete="cc-name"
        @blur="markTouched('card_holder')"
      />
      <small v-if="visibleErrors.card_holder" class="text-red-500">
        {{ visibleErrors.card_holder }}
      </small>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label for="expiry">Expiration</label>
        <InputMask
          id="expiry"
          v-model="form.expiry"
          mask="99/99"
          placeholder="MM/AA"
          :invalid="!!visibleErrors.expiry"
          autocomplete="cc-exp"
          inputmode="numeric"
          @blur="markTouched('expiry')"
        />
        <small v-if="visibleErrors.expiry" class="text-red-500">
          {{ visibleErrors.expiry }}
        </small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="cvv">CVV</label>
        <InputMask
          id="cvv"
          v-model="form.cvv"
          mask="999?9"
          placeholder="123"
          :invalid="!!visibleErrors.cvv"
          autocomplete="cc-csc"
          inputmode="numeric"
          @blur="markTouched('cvv')"
        />
        <small v-if="visibleErrors.cvv" class="text-red-500">
          {{ visibleErrors.cvv }}
        </small>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        label="Annuler la commande"
        severity="secondary"
        :disabled="submitting"
        @click="handleCancel"
      />
      <Button
        type="submit"
        label="Payer"
        icon="pi pi-lock"
        class="bg-[#3525CD] border-[#3525CD]"
        :loading="submitting"
      />
    </div>
  </form>
</template>
