<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Meeting Center` : 'Meeting Center'
  },
})
const items = ref([
  {
    label: 'Meeting Center',
    icon: 'pi pi-link',
    route: '/',
  },
])

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
</script>

<template>
  <div class="h-full">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <NuxtLink
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </NuxtLink>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
      </template>

      <template #end>
        <ClientOnly>
          <UiUserMenu v-if="isLoggedIn" />
          <NuxtLink v-else to="/login">
            <Button label="登入" />
          </NuxtLink>
        </ClientOnly>
      </template>
    </Menubar>
    <div class="lg:grid grid-cols-11 h-full gap-x-6">
      <UiSideMenu class="col-span-2" />
      <div class="col-span-9 m-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
body,
html {
  height: 100%;
}

#__nuxt {
  height: 100%;
}
</style>
