<script setup lang="ts">
import { MeetEdit } from '#components'

const route = useRoute()
const queryMeetId = route.params.id as string
type MeedEditPropsType = NonNullable<
  InstanceType<typeof MeetEdit>['$props']['values']
>
const data = ref<MeedEditPropsType>({
  title: '',
  desc: '',
  attendants: [],
  date: new Date(),
  room: {
    id: '',
    name: '',
    building: '',
    eating: false,
    timeslots: [],
  },
})

const reserveInfoApi = await apiGetReserveInfo(queryMeetId)

watchEffect(async () => {
  if (!isDefined(reserveInfoApi.data)) return
  ;({
    title: data.value.title,
    desc: data.value.desc,
    attendants: data.value.attendants,
  } = reserveInfoApi.data.value)
  data.value.date = new Date(reserveInfoApi.data.value.rDate)
  data.value.room.timeslots = reserveInfoApi.data.value.timeSlots

  const roomInfoApi = await apiGetRoomInfo(reserveInfoApi.data.value.roomId)
  if (isDefined(roomInfoApi.data)) {
    const roomData = roomInfoApi.data.value

    ;({
      _id: data.value.room.id,
      name: data.value.room.name,
      building: data.value.room.building,
      eating: data.value.room.eating,
    } = roomData)
  }
})

const patchMeetingHandler = (
  newData: Parameters<InstanceType<typeof MeetEdit>['$emit']>[1]
) => {
  console.log(newData)
  const { data: info, timeslots: timeSlot } = newData

  const response=ref()
  apiUpdateReserveInfo(queryMeetId, {
    title: info.title,
    attendants: info.attendants,
    rDate: formatDateString(info.date),
    roomId: info.room.id,
    desc: info.desc,
    userId: useUserStore().data.id,
    timeSlot,
  }).then(function({data}){
    response.value=data.value
  })

  watch(response, ()=>{
    if(isDefined(response)){
      navigateTo('/')
    }
  })
}
</script>

<template>
  <div>
    <h1 class="font-bold text-4xl">修改預約</h1>
    <MeetEdit class="mt-8" :values="data" @submit="patchMeetingHandler" @cancel="useRouter().back()"/>
  </div>
</template>
