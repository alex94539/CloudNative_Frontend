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

const confirmService = useConfirm()
const deleteRoomHandler = (room: RoomInfo) => {
  confirmService.require({
    header: '警告',
    icon: 'pi pi-exclamation-triangle',
    message: `確定要刪除「${room.name}」會議室嗎？`,
    rejectLabel: '取消',
    acceptLabel: '確認',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    blockScroll: true,
  })
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
            <Button
              :severity="'danger'"
              icon="pi pi-trash"
              @click="() => deleteRoomHandler(slotProps.data)"
            />
          </div>
          <AdminEditRoomModal
            v-model:visible="editRoomModalVisible"
            title="編輯會議室"
            :data="roomInfo!"
            @submit="modalSubmitHandler($event)"
          />
          <ConfirmDialog />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
