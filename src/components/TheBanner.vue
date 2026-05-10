<script setup lang="ts">
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: 'Vous avez un talent ?',
  description: "Commencez à proposer vos services dès aujourd'hui et arrondissez vos fins de mois.",
  ctaLabel: 'Devenir vendeur',
  ctaTo: '/',
})
const emit = defineEmits<{ (e: 'click'): void }>()
const router = useRouter()

function handleClick() {
  emit('click')
  if (props.ctaTo) {
    router.push(props.ctaTo)
  }
}
</script>
<template>
  <div class="mx-auto w-full  px-4 sm:px-6 lg:px-8 max-w-6xl">
    <section
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-5 sm:px-8 sm:py-6 rounded-2xl bg-indigo-50"
      aria-label="Devenir vendeur sur MarketHub"
    >
      <div class="min-w-0">
        <h2 class="text-base sm:text-lg font-bold text-slate-900">{{ title }}</h2>
        <p class="mt-1 text-sm text-[#4338CA]">{{ description }}</p>
      </div>
      <Button :label="ctaLabel" @click="handleClick" class="bg-[#4F46E5]" />
    </section>
  </div>
</template>
