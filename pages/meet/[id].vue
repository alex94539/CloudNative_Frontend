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
    ;({ title: data.value.title, desc: data.value.desc } = api.data.value)
  }
})

const data = ref({
  title: '',
  desc: '',
  host: '',
  date: '',
  timeslot: [],
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
</script>

<template>
  <div>
    <MeetDetails
      v-if="isApiLoaded"
      :values="data"
      :is-host="api.data.value?.userId === useUserStore().data.id"
    ></MeetDetails>
  </div>
</template>
