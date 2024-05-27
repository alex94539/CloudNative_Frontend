<script setup lang="ts"></script>

<template>
  <div class="w-fit mx-auto mt-32">
    <Login @login-success="navigateTo('/')" />
  </div>
</template>
