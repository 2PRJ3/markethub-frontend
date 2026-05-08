<script setup lang="ts">
import TheSearchBar from '@/components/TheSearchBar.vue'
import TheCard from '@/components/TheCard.vue'
import TheNavbar from '@/components/TheNavbar.vue'
</script>

<template>
  <header>
    <TheNavbar />
  </header>
  <section class="flex flex-col items-center justify-center gap-5 px-4 py-20">
    <h1
      class="text-center text-2xl font-bold text-gray-900 sm:text-5xl md:text-3xl lg:text-6xl max-w-4xl leading-tight tracking-tight"
    >
      Trouvez les services parfaits pour vos projets étudiants
    </h1>
    <TheSearchBar />
  </section>

  <section class="flex flex-col gap-5 px-8 pr-8">
    <div class="flex flex-col">
      <h2 class="font-bold text-2xl">Nos services</h2>
      <div class="flex justify-between">
        <span class="text-[#464555]">Découvrez ce que la communauté vous propose.</span>
        <router-link to="/" class="hidden md:flex md:items-end gap-1 text-[#3525CD]">
          <span class="text-sm">Voir tout</span>
          <i class="pi pi-arrow-right" />
        </router-link>
      </div>
    </div>
    <div class="flex items-center md:justify-start justify-center py-5">
      <TheCard />
    </div>
  </section>
</template>
