<script setup lang="ts">
const props = defineProps<{ values?: typeof defaultData }>()
const emits = defineEmits<{
  cancel: []
  submit: [{ data: typeof defaultData; timeslots: number[] }]
}>()
const data = ref(props.values ?? defaultData)

const roomApi = await apiGetRoomList()

const propRefs = toRefs(props)
const roomOptions = computed(() => {
  if (!isDefined(roomApi.data)) {
    console.log(propRefs.values.value?.room)
    return isDefined(propRefs.values)
      ? [
          {
            name: `${propRefs.values.value.room.building} - ${propRefs.values.value.room.name}`,
            id: propRefs.values.value.room.id,
          },
        ]
      : []
  }

  return roomApi.data.value.map((x) => ({
    name: `${x.building} - ${x.name}`,
    id: x._id,
  }))
})
const selectedRoomId = ref(
  isDefined(propRefs.values) ? propRefs.values.value.room.id : ''
)

const isRoomSelected = computed(() => selectedRoomId.value.length > 0)
watch(
  () => propRefs.values.value,
  (v) => {
    if (!v) return
    selectedRoomId.value = v.room.id
    startTimeslotSelection.value = {
      code: v.room.timeslots[0],
      name: displayTimeslot(v.room.timeslots[0]),
    }
    data.value.desc = v.desc
  },
  { deep: true }
)

// Get info of selected room
watchEffect(async () => {
  if (!isRoomSelected.value) return

  const api = await apiGetRoomInfo(selectedRoomId.value)
  console.log(api.data.value)
})

const availableTimeslots = ref<number[]>(
  isDefined(propRefs.values) ? propRefs.values.value.room.timeslots : []
)

// Get occupied timeslots for selected room
watchEffect(async () => {
  if (!isRoomSelected.value) return

  const api = await apiGetRoomTimeslotInfo(
    selectedRoomId.value,
    formatDateString(data.value.date)
  )
  if (isDefined(api.data)) {
    const allTimeslots = 2 * 12
    let occupiedIds = api.data.value.map((x) => x.timeSlot)

    if (isDefined(propRefs.values)) {
      occupiedIds = [
        ...occupiedIds.filter(
          (x) => !propRefs.values.value!.room.timeslots.includes(x)
        ),
      ]
    }

    const allTimeslotIds = [...Array(allTimeslots).keys()]
    availableTimeslots.value = allTimeslotIds.filter(
      (x) => !occupiedIds.includes(x)
    )
  }
})
const uploadFile = ref<FileList>()

const startTimeslotSelection = ref(
  isDefined(propRefs.values)
    ? {
        code: propRefs.values.value.room.timeslots[0],
        name: displayTimeslot(propRefs.values.value.room.timeslots[0]),
      }
    : {
        code: -1,
        name: '',
      }
)
const endTimeslotSelection = ref(
  isDefined(propRefs.values)
    ? {
        code: propRefs.values.value.room.timeslots.at(-1)!,
        name: displayTimeslot(propRefs.values.value.room.timeslots.at(-1)! + 1),
      }
    : {
        code: -1,
        name: '',
      }
)

const endTimeslotChoices = computed(() => {
  if (isDefined(propRefs.values) && !isDefined(availableTimeslots)) {
    return [propRefs.values.value.room.timeslots.at(-1)!]
  }
  if (startTimeslotSelection.value.code != -1) {
    const startIdx = availableTimeslots.value.indexOf(
      startTimeslotSelection.value.code
    )
    return [...availableTimeslots.value].slice(startIdx)
  }
  return []
})

const startTimeslotOptions = computed(() => {
  return availableTimeslots.value.map((x) => {
    return { code: x, name: displayTimeslot(x) }
  })
})

const submitHandler = () => {
  console.log(startTimeslotSelection.value.code)
  console.log(endTimeslotSelection.value.code)
  emits('submit', {
    data: toRaw(data.value),
    timeslots: [...Array(endTimeslotSelection.value.code+1).keys()].slice(
      startTimeslotSelection.value.code
    ),
  })
}
</script>

<script lang="ts">
const tomorrowDate = () => new Date(new Date().getTime() + 1000 * 3600 * 24)
const defaultData = {
  title: '',
  date: tomorrowDate(),
  desc: '',
  attendants: [] as string[],
  room: {
    name: '',
    id: '',
    timeslots: [] as number[],
    building: '',
    eating: false,
  },
}
</script>

<template>
  <div>
    <Card class="mt-8">
      <template #content>
        <div class="grid grid-cols-2 gap-10">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label>會議名稱</label>
              <InputText v-model="data.title" />
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
                v-model="selectedRoomId"
                placeholder="選擇會議室"
                :loading="roomApi.pending.value"
                :options="roomOptions"
                option-label="name"
                option-value="id"
              />
            </div>

            <Transition name="fade">
              <div v-show="isRoomSelected" class="flex flex-col gap-1">
                <label>預約時段</label>
                <div class="flex w-full gap-2 items-center">
                  <Dropdown
                    v-model="startTimeslotSelection"
                    placeholder="選擇開始時間"
                    :options="startTimeslotOptions"
                    option-label="name"
                    class="w-full"
                  />
                  -
                  <Dropdown
                    v-model="endTimeslotSelection"
                    placeholder="選擇結束時間"
                    :disabled="startTimeslotSelection.code == -1"
                    option-label="name"
                    :options="
                      endTimeslotChoices.map((x) => {
                        return { code: x, name: displayTimeslot(x + 1) }
                      })
                    "
                    class="w-full"
                  />
                </div>
                <small>最小預約單位為30分鐘</small>
              </div>
            </Transition>

            <div class="flex flex-col">
              <div>會議大綱</div>

              <Textarea v-model="data.desc" class="mt-1" />
            </div>
          </div>
          <div>
            <div class="flex flex-col">
              <Fieldset legend="與會者">
                <Chips></Chips>
                <div class="mt-2">
                  <Chip>您</Chip>
                </div>
              </Fieldset>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <div class="flex justify-end gap-2 mt-4">
      <Button label="取消" outlined @click="emits('cancel')" />
      <Button label="完成" @click="submitHandler" />
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
