<script setup lang="ts">
import { computed } from 'vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import type { UserPublic } from '@/types/user'
import avatarImage from '@/assets/pictures/avatar.png'

const props = defineProps<{
  user: UserPublic
  hideContactButton?: boolean
}>()

const fullName = computed(() => `${props.user.first_name} ${props.user.last_name}`)

const userAvatar = computed(() => {
  const url = props.user?.avatar_url
  return url && url !== 'string' ? url : avatarImage
})
const subtitle = computed(() => {
  const parts: string[] = []
  if (props.user.university) parts.push(props.user.university)
  if (props.user.study_sector) parts.push(props.user.study_sector)
  return parts.join(' • ')
})

function onContact(): void {
  console.log('Contact', props.user.id)
}
</script>

<template>
  <header>
    <div class="h-48 bg-linear-to-r from-[#2921A3] to-[#7B6FE0] rounded-b-lg" aria-hidden="true" />

    <div class="px-6 -mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <Avatar
          :image="userAvatar"
          shape="circle"
          class="w-32 h-32 border-4 border-white shadow-md"
        />

        <div class="md:pb-2">
          <h1 class="text-2xl font-semibold text-slate-900">{{ fullName }}</h1>
          <p v-if="subtitle" class="text-slate-600">{{ subtitle }}</p>
        </div>
      </div>

      <div v-if="!hideContactButton" class="md:pb-2">
        <Button
          label="Envoyer un message"
          icon="pi pi-send"
          class="bg-[#2921A3] border-[#2921A3]"
          @click="onContact"
        />
      </div>
    </div>
  </header>
</template>
