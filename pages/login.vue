<script setup lang="ts">
definePageMeta({ middleware: ['login-layout'] })
useHead({ title: '登入' })
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <Login @login-success="navigateTo('/')" />
  </div>
</template>
