<script setup lang="ts">
import type { AdminCreateRoomHandler } from '#build/components'

const items = ref([
  {
    label: '會議室',
    route: '/admin/room',
    icon: 'pi pi-table',
  },
  {
    label: '使用者',
    route: '/admin/user',
    icon: 'pi pi-user',
  },
])
const createRoomModal = ref<InstanceType<typeof AdminCreateRoomHandler>>()
const splitBtnItems = [
  {
    label: '建立會議室',
    icon: 'pi pi-refresh',
    command: () => {
      createRoomModal.value?.show()
    },
  },
  {
    label: '建立使用者',
    icon: 'pi pi-times',
    command: () => {},
  },
  {
    label: '建立會議',
    icon: 'pi pi-external-link',
    command: () => {},
  },
]
</script>
<template>
  <div class="pt-10">
    <AdminCreateRoomHandler ref="createRoomModal" />
    <SplitButton class="w-full" :model="splitBtnItems" label="新增">
    </SplitButton>

    <PanelMenu :model="items">
      <template #item="{ item }">
        <NuxtLink
          v-if="item.route"
          :to="item.route"
          :data-active-route="useRoute().path.startsWith(item.route)"
        >
          <div class="flex items-center cursor-pointer text-color px-3 py-2">
            <i :class="item.icon"></i>
            <span class="ml-2 text-color">{{ item.label }}</span>
          </div>
        </NuxtLink>
        <a
          v-else
          v-ripple
          class="flex items-center cursor-pointer text-color px-3 py-2"
          :href="item.url"
          :target="item.target"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span
            v-if="item.items"
            class="pi pi-angle-down text-primary ml-auto"
          />
        </a>
      </template>
    </PanelMenu>
  </div>
</template>
