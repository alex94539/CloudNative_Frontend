<script setup lang="ts">
const visible = ref(false)

defineExpose({
  show: () => {
    visible.value = true
  },
})

const sha256 = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}
const toast = useToast()
const submitHandler = async (data: UserListItem) => {
  const shaPwd = await sha256(data.password)
  const payload = { ...data }
  payload.password = shaPwd

  watchEffect(async () => {
    const api = await apiCreateUserInfo(payload)
    const { data } = api

    if (data.value !== null) {
      visible.value = false
      toast.add({ summary: '成功新增使用者帳號', severity: 'success', life: 3000 })
      if (useRoute().path === '/admin/user') {
        await apiGetUserList()
      }
    }
  })
}
</script>

<template>
  <AdminEditUserModal
    v-model:visible="visible"
    title="建立使用者帳號"
    @submit="submitHandler($event)"
  />
</template>
