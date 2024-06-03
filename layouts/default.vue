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
    <div v-if="isLoggedIn" class="lg:grid grid-cols-11 h-full gap-x-6">
      <UiSideMenu class="col-span-2 ml-6" />
      <div class="col-span-9 m-10">
        <slot />
      </div>
    </div>
    <div class="flex w-full px-44">
      <div class="flex flex-col grow">
        <div class="font-black text-7xl mt-[25vh]">Meeting Center</div>
        <div class="font-bold text-4xl mt-6">會議室預約系統</div>
      </div>
      <div>
        <img src="~/assets/195.Collaboration.png" alt="">
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
