<script setup lang="ts">
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Rating from 'primevue/rating'

import imagedefault from '@/assets/pictures/Background.png'
import avatar from '@/assets/pictures/avatar.png'
</script>

<template>
  <Card style="width: max-content; overflow: hidden">
    <template #header>
      <div class="relative">
        <img :src="imagedefault" alt="logo" />
        <Tag value="Design" severity="info" class="absolute" style="left: 5px; top: 5px" />
      </div>
    </template>
    <template #title>
      <div class="flex items-center gap-3">
        <Avatar :image="avatar" shape="circle" />
        <span class="text-sm">Thomas D.</span>
      </div>
    </template>

    <template #content>
      <div>
        <span class="font-semibold text-gray-900 leading-tight tracking-tigh"
          >Design de logos minimalistes</span
        >
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center gap-3">
        <div class="flex items-center gap-2">
          <Rating
            :stars="1"
            :pt="{
              onIcon: { class: 'pi pi-star-fill !text-yellow-400 hover:border-none' },
              offIcon: { class: 'pi pi-star-fill !text-yellow-400 hover:border-none' },
            }"
          />
          <span>4.9</span>
        </div>

        <div>
          <span class="text-gray-950">Dés 15 €</span>
        </div>
      </div>
    </template>
  </Card>
</template>
