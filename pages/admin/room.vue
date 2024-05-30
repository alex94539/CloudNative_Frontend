<script setup lang="ts">
import type { RoomInfo } from '@/utils/useApi'

const { data: roomList, refresh } = await apiGetRoomList()
const editRoomModalVisible = ref(false)
const roomInfo = ref<RoomInfo>()

const openEditModal = (roomId: string) => {
  console.log(roomId)

  watchEffect(async () => {
    const api = await apiGetRoomInfo(roomId)
    if (api.data.value !== null) {
      editRoomModalVisible.value = true
      roomInfo.value = api.data.value
    }
  })
}

const checkModifyData = (modalData: RoomInfo) => {
  if (JSON.stringify(modalData) === JSON.stringify(roomInfo.value)) return false
  return true
}

const modalSubmitHandler = (modalData: RoomInfo) => {
  if (checkModifyData(modalData)) {
    console.log('hello')
    watchEffect(async () => {
      const api = await apiPatchRoomInfo(modalData)
      if (api.data.value !== null) {
        editRoomModalVisible.value = false
        refresh()
      }
    })
  } else editRoomModalVisible.value = false
}
</script>
<template>
  <div>
    <DataTable :value="roomList" table-style="min-width: 50rem">
      <Column field="name" header="名稱"></Column>
      <Column field="building" header="館別"></Column>
      <Column header="操作">
        <template #body="slotProps">
          <div class="flex gap-x-2">
            <Button
              icon="pi pi-pencil"
              @click="() => openEditModal(slotProps.data._id)"
            />
            <Button :severity="'danger'" icon="pi pi-trash" />
          </div>
          <AdminEditRoomModal
            v-model:visible="editRoomModalVisible"
            :data="roomInfo!"
            @submit="modalSubmitHandler($event)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
