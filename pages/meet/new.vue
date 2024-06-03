<script setup lang="ts">
import Editor from 'primevue/editor'
import { type RoomTimeSlot } from '@/utils/useApi'
const data = ref(defaultData)

const roomApi = await apiGetRoomList()
const roomList = computed(() => {
  if (roomApi.data.value === null) return []

  return roomApi.data.value.map((v, i) => {
    return { no: i, name: `${v.building}-${v.name}` }
  })
})
interface TimeSlotChoice {
  timeslot: RoomTimeSlot
  displayName: string
}
const availableTimeslots = ref<TimeSlotChoice[]>([])
const selectedRoom = ref({ no: -1, name: '' })
const selectedStartTimeSlot = ref<TimeSlotChoice>()
const selectedEndTimeSlot = ref<TimeSlotChoice>()
const isEndTimeslotSelectionAllowed = computed(() => {
  if (selectedStartTimeSlot.value === undefined) return false
  return true
})
const endTimeslotChoices = computed(():TimeSlotChoice[] => {
  if(!(isEndTimeslotSelectionAllowed.value))  return []
  const startIdx=availableTimeslots.value.indexOf(selectedStartTimeSlot.value!)
  return [...availableTimeslots.value].slice(startIdx+1)
})

const formatDateString = (date: Date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 10)
}
watchEffect(async () => {
  if (selectedRoom.value.no != -1) {
    const api = await apiGetRoomTimeslotInfo(
      roomApi.data.value![selectedRoom.value.no]._id,
      formatDateString(data.value.date)
    )
    if (api.data.value !== null) {
      const allTimeslots = 2 * 12
      const timeslotIds = [...Array(allTimeslots).keys()]
      const occupiedIds = api.data.value.map((v) => v.timeSlot)
      const availableTimeslotIds = timeslotIds.filter(
        (x) => !occupiedIds.includes(x)
      )
      availableTimeslots.value = availableTimeslotIds.map((x) => {
        return {
          timeslot: x,
          displayName: displayTimeslot(x),
        }
      })
    }
  }
})

const fileToUpload = ref<FileList>()

const toast = useToast()
const submitHandler = async () => {
  const emptyFileList = new DataTransfer().files
  const api = await apiCreateReserveInfo(
    {
      rDate: formatDateString(data.value.date),
      title: data.value.name,
      desc: data.value.desc,
      roomId: roomApi.data.value![selectedRoom.value.no]._id,
      timeSlot: [...Array(selectedEndTimeSlot.value?.timeslot).keys()].slice(selectedStartTimeSlot.value?.timeslot),
      attendants: [useUserStore().data.id],
      userId: useUserStore().data.id,
    },
    fileToUpload.value ?? emptyFileList
  )
  return api
}
</script>

<script lang="ts">
const tomorrowDate = () => new Date(new Date().getTime() + 1000 * 3600 * 24)
const defaultData = {
  name: '',
  date: tomorrowDate(),
  room: '',
  desc: '',
}
</script>

<template>
  <div>
    <h1 class="font-bold text-4xl">建立預約</h1>
    <Card class="mt-8">
      <template #content>
        <div class="grid grid-cols-2 gap-10">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label>會議名稱</label>
              <InputText v-model="data.name" />
            </div>
            <div class="flex flex-col gap-1">
              <div>會議日期</div>
              <Calendar
                v-model="data.date"
                date-format="yy/mm/dd"
                :manual-input="false"
                panel-class="!min-w-[20rem] !max-w-[22rem]"
                :min-date="tomorrowDate()"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label>會議室</label>
              <Dropdown
                v-model="selectedRoom"
                placeholder="選擇會議室"
                :loading="roomApi.pending.value"
                :options="roomList"
                option-label="name"
              />
            </div>

            <Transition name="fade">
              <div v-show="selectedRoom.no !== -1" class="flex flex-col gap-1">
                <label>預約時段</label>
                <div class="flex w-full gap-2">
                  <Dropdown
                    v-model="selectedStartTimeSlot"
                    placeholder="選擇開始時間"
                    :options="availableTimeslots"
                    option-label="displayName"
                    class="w-full"
                  />
                  <Dropdown
                    v-model="selectedEndTimeSlot"
                    placeholder="選擇結束時間"
                  :disabled="!isEndTimeslotSelectionAllowed"
                    option-label="displayName"
                    :options="endTimeslotChoices"
                    class="w-full"
                  />
                </div>
                <small>最小預約單位為30分鐘</small>
              </div>
            </Transition>

            <div class="flex flex-col">
              <div>會議大綱</div>
              <Editor
                v-model="data.desc"
                editor-style="min-height: 10rem; height: fit-content; "
                class="mt-1"
              />

              <UiFileUpload
                v-model="fileToUpload"
                class="mt-2"
                accept="image/*,.pdf,.zip"
              />
            </div>
          </div>
          <div>
            <div class="flex flex-col">
              <Fieldset legend="與會者">
                <Chips></Chips>
                <div>
                  <Chip>您</Chip>
                </div>
              </Fieldset>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <div class="flex justify-end gap-2 mt-4">
      <Button label="取消" outlined />
      <Button
        label="下一步"
        @click="
          submitHandler().then(({ data }) => {
            if (data.value !== null) {
              toast.add({
                summary: '成功預約會議室',
                severity: 'success',
                life: 3000,
              })
              navigateTo('/')
            }
          })
        "
      />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  @apply ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
