<script setup lang="ts">
const emits = defineEmits<{
  logout: []
}>()
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: '登出',
        icon: 'pi pi-refresh',
        command: () => {
          emits('logout')
          loginHelper.logout()
        },
      },
    ],
  },
])

const menu = ref()

const toggleMenu = (ev: Event) => menu.value.toggle(ev)

const userStore = useUserStore()
const { data } = storeToRefs(userStore)
</script>

<template>
  <div>
    <Button class="flex items-center gap-2" @click="toggleMenu" outlined>
      {{ data.username }}
      <Avatar
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        :shape="'circle'"
      />
    </Button>
    <Menu ref="menu" :model="items" :popup="true"></Menu>
  </div>
</template>
