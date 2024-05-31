<script setup lang="ts">
import type { RoomInfo } from '~/utils/useApi'

const visible = ref(false)
defineExpose({
  show: () => {
    visible.value = true
  },
})
const toast = useToast()
const submitHandler = (data: RoomInfo) => {
  const { _id, ...body } = data

  watchEffect(async () => {
    const api = await apiCreateRoomInfo(body)

    if (api.data.value !== null) {
      visible.value = false
      toast.add({ summary: '成功新增會議室', severity: 'success', life: 3000 })

      if (useRoute().path === '/admin/room') {
        await apiGetRoomList()
      }
    }
  })
}
</script>
<template>
  <AdminEditRoomModal
    v-model:visible="visible"
    title="建立會議室"
    @submit="submitHandler($event)"
  />
</template>
