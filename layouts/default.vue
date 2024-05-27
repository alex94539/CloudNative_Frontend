<script setup lang="ts">
const items = ref([
  {
    label: 'Meeting Center',
    icon: 'pi pi-link',
    route: '/',
  },
  // {
  //   label: 'Router',
  //   icon: 'pi pi-palette',
  //   items: [
  //     {
  //       label: 'Styled',
  //       route: '/theming',
  //     },
  //     {
  //       label: 'Unstyled',
  //       route: '/unstyled',
  //     },
  //   ],
  // },
  // {
  //   label: 'External',
  //   icon: 'pi pi-home',
  //   items: [
  //     {
  //       label: 'Vue.js',
  //       url: 'https://vuejs.org/',
  //     },
  //     {
  //       label: 'Vite.js',
  //       url: 'https://vuejs.org/',
  //     },
  //   ],
  // },
])

const identityStore = useUserIdentityStore()
const { isLoggedIn } = storeToRefs(identityStore)
</script>

<template>
  <div class="card">
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
        <div v-if="isLoggedIn" class="flex items-center gap-2">
          Username
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            :shape="'circle'"
          />
        </div>

        <NuxtLink v-else to="/login">
          <Button label="登入" />
        </NuxtLink>
      </template>
    </Menubar>
    <slot />
  </div>
</template>
