<script setup lang="ts">
const { data } = await apiGetMeetingsInfo()
</script>

<template>
  <div>
    <div class="mt-8 font-medium text-2xl">
      {{ (data ?? []).length > 0 ? '即將到來的會議' : '尚無即將到來的會議' }}
    </div>
    <div class="">
      <div>
        <div class="grid grid-cols-2 gap-8 mt-4">
          <Card
            v-for="i in data"
            :key="i._id"
            class="min-w-[25rem] cursor-pointer ease-in transition-shadow shadow-md hover:shadow-lg"
            @click="navigateTo(`/meet/${i._id}`)"
          >
            <template #content>
              <div class="flex">
                <div class="flex flex-col grow">
                  <div class="text-xl font-medium grow">{{ i.title }}</div>
                  <div class="flex flex-col mt-6 gap-y-2">
                    <div>
                      <i class="pi pi-calendar" />
                      {{ i.rDate }}
                    </div>
                    <div v-if="i.timeSlots.length >= 2">
                      <i class="pi pi-clock" />
                      {{ displayTimeslot(i.timeSlots[0]) }}~{{
                        displayTimeslot(i.timeSlots.at(-1)!+1)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
