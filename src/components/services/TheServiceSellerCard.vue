<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import avatarDefault from '@/assets/pictures/avatar.png'
import type { SellerSummary, ServiceSummary } from '@/types/service'

const props = defineProps<{
  seller: SellerSummary | null | undefined
  createdAt: string
}>()

const router = useRouter()

const sellerName = computed(() => {
  if (!props.seller) return 'Anonyme'
  const lastInitial = props.seller.last_name?.[0] ? `${props.seller.last_name[0]}.` : ''
  return `${props.seller.first_name} ${lastInitial}`.trim()
})

const sellerAvatar = computed(() => {
  const url = props.seller?.avatar_url
  return url && url !== 'string' ? url : avatarDefault
})

const memberSince = computed(() => {
  if (!props.createdAt) return ''
  return new Date(props.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
})
function goToSellerProfile(): void {
  if (props.seller?.id) {
    router.push(`/users/${props.seller.id}`)
  }
}
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-slate-900 mb-4">À propos du vendeur</h2>
    <div class="border border-slate-200 rounded-2xl p-6 bg-white">
      <div class="flex items-start gap-4 mb-4">
        <Avatar :image="sellerAvatar" shape="circle" size="xlarge" />
        <div class="flex-1">
          <h3 class="font-bold text-slate-900">{{ sellerName }}</h3>
          <p class="text-sm text-slate-500">
            {{ props.seller?.university || '—' }}
          </p>
        </div>
      </div>

      <p v-if="props.seller?.bio" class="text-slate-700 italic mb-4">"{{ props.seller.bio }}"</p>

      <p class="text-xs text-slate-500 mb-4">Membre depuis {{ memberSince }}</p>

      <div class="flex gap-3">
        <Button
          label="Voir le profil"
          severity="secondary"
          outlined
          size="small"
          @click="goToSellerProfile"
        />
        <Button label="Envoyer un message" outlined size="small" severity="info" />
      </div>
    </div>
  </section>
</template>
