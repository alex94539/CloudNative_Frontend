<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    values?: ReservationData
    isHost: boolean
  }>(),
  { values: () => defaultData }
)
const emits=defineEmits<{
  delete: []
  edit: []
}>()

const data = ref(defaultData)
</script>

<script lang="ts">
interface ReservationData {
  title: string
  timeslots: number[]
  attendants: string[]
  host: string
  desc: string
  date: string
  roomInfo: {
    room: string
    building: string
    eating: boolean
    capacity: number
    area: number
  }
}
const defaultData: ReservationData = {
  title: '',
  desc: '',
  host: '',
  date: '',
  attendants: [],
  timeslots: [],
  roomInfo: {
    room: '',
    building: '',
    eating: false,
    capacity: 0,
    area: 0,
  },
}
</script>

<template>
  <div>
    <h1 class="font-bold text-4xl">預約詳情</h1>
    <Card class="mt-4">
      <template #content>
        <div class="flex">
          <h1 class="font-semibold text-3xl grow">{{ props.values.title }}</h1>
          <div v-if="props.isHost" class="flex gap-1">
            <Button label="刪除" @click="emits('delete')" severity="danger" />
            <Button  label="編輯" @click="emits('edit')" />
          </div>
        </div>
        <div>
          <div class="flex flex-col gap-2 mt-4">
            <div v-if="isHost">由您發起</div>
            <div v-else>由{{ ` ${props.values.host} ` }}發起</div>
            <div>
              <i class="pi pi-clock" />
              {{ displayTimeslot(props.values.timeslots[0]) }}~{{
                displayTimeslot(props.values.timeslots.at(-1)!+1)
              }}
            </div>
            <div>
              <i class="pi pi-building" />
              {{ props.values.roomInfo.building }} -
              {{ props.values.roomInfo.room }}
            </div>
            <div v-if="!props.values.roomInfo.eating">
              <i class="pi pi-exclamation-circle text-red-500" />
              禁止飲食
            </div>
          </div>
          <div class="mt-8">
            <div class="font-semibold text-xl">與會者</div>
            <ul class="list-disc list-inside pl-2 mt-2">
              <li v-for="i in props.values.attendants" :key="i">
                {{ i }}
              </li>
            </ul>
          </div>
          <div class="mt-8">
            <div class="font-semibold text-xl">會議大綱</div>
            <div
              v-if="props.values.desc !== ''"
              class="mt-2"
              v-html="props.values.desc"
            ></div>
            <div v-else class="mt-2">尚無會議大綱</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
