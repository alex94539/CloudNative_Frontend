<script setup lang="ts">
const route = useRoute()
const queryMeetId = route.params.id as string

const api = await apiGetMeetingInfo(queryMeetId)
api.execute()

// Get user info of host
watchEffect(async () => {
  if (api.data.value === null) return
  const userData = await apiGetUserInfo(api.data.value.userId)
  if (userData.data.value !== null)
    data.value.host = userData.data.value.username
})

// Get room info
watchEffect(async () => {
  if (api.data.value === null) return
  const roomData = await apiGetRoomInfo(api.data.value.roomId)
  if (roomData.data.value !== null) {
    const roomInfo = {
      room: roomData.data.value.name,
      building: roomData.data.value.building,
      eating: roomData.data.value.eating,
      capacity: roomData.data.value.capacity,
      area: roomData.data.value.area,
    }
    data.value.roomInfo = roomInfo
    ;({
      title: data.value.title,
      desc: data.value.desc,
      timeSlots: data.value.timeslots,
    } = api.data.value)
  }
})

const data = ref({
  title: '',
  desc: '',
  host: '',
  date: '',
  timeslots: [] as number[],
  attendants: [] as string[],
  roomInfo: {
    room: '',
    building: '',
    eating: false,
    capacity: 0,
    area: 0,
  },
})
const isApiLoaded = computed(
  () => api.data.value !== null && api.status.value === 'success'
)
watch(api.data, (v) => console.log(v))

watchEffect(async () => {
  if (api.data.value === null) return

  const attenantsData = await Promise.all(
    api.data.value.attendants.map((x) => apiGetUserInfo(x))
  )
  data.value.attendants = attenantsData.map((x) => x.data.value!.username)
})

const confirmService = useConfirm()
const toast = useToast()
const cancelMeetingHandler = () => {
  confirmService.require({
    header: '警告',
    icon: 'pi pi-exclamation-triangle',
    message: `確定要取消「${data.value.title}」嗎？`,
    rejectLabel: '取消',
    acceptLabel: '確認',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    blockScroll: true,
    accept() {
      apiCancelMeeting(queryMeetId).then(() => {
        toast.add({
          summary: '成功取消會議預約',
          severity: 'success',
          life: 3000,
        })
        navigateTo('/')
      })
    },
  })
}
</script>

<template>
  <div>
    <ConfirmDialog />
    <MeetDetails
      v-if="isApiLoaded"
      :values="data"
      :is-host="api.data.value?.userId === useUserStore().data.id"
      @edit="navigateTo(`/meet/edit/${queryMeetId}`)"
      @delete="cancelMeetingHandler"
    ></MeetDetails>
  </div>
</template>
