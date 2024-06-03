<script setup lang="ts">
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)
</script>

<template>
  <div>
    <template v-if="isLoggedIn">
      <div class="mx-16">
        <h1 class="text-6xl font-black">歡迎回來</h1>
        <AdminHome v-if="isAdmin"></AdminHome>
        <UserHome v-else />
      </div>
    </template>
  </div>
</template>
