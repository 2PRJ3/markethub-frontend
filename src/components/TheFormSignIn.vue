<script setup lang="ts">
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
</script>
<template>
  <div class="flex flex-col gap-10 w-max pt-10">
    <!--  Firstname and Lastname-->
    <div class="flex flex-row gap-5">
      <div class="flex flex-col gap-2">
        <label for="firstname" class="font-semibold">Prénom</label>
        <InputText
          id="firstname"
          aria-describedby="firstname-help"
          class="focus:border-[#3525CD]"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="lastname" class="font-semibold">Nom</label>
        <InputText id="lastname" aria-describedby="firstname-help" class="focus:border-[#3525CD]" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="email" class="font-semibold">Email</label>
      <InputText id="email" aria-describedby="email-help" fluid class="focus:border-[#3525CD]" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="password" class="font-semibold">Mot de passe</label>
      <Password toggleMask class="focus:border-[#3525CD]" fluid :feedback="false" />
    </div>

    <Button label="S'inscrire" class="bg-[#4F46E5]" />
  </div>
</template>
