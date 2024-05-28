<script setup lang="ts">
setPageLayout('blank')
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <Login @login-success="navigateTo('/')" />
  </div>
</template>
