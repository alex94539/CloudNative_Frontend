<script setup lang="ts">
definePageMeta({ middleware: ['login-layout'] })
</script>
<template>
  <div class="flex h-screen items-center justify-center">
    <Login @login-success="navigateTo('/')" />
  </div>
</template>
