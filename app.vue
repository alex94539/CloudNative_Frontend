<script lang="ts" setup>
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'
useNuxtApp().vueApp.use(ToastService)
</script>

<template>
  <NuxtLayout>
    <Toast />
    <NuxtPage />
  </NuxtLayout>
</template>
