<script setup lang="ts">
import type { RoomInfo } from '~/utils/useApi'

type ModalData = Omit<RoomInfo, '__v'>

const defaultData: ModalData = {
  _id: '',
  name: '',
  building: '',
  capacity: 0,
  area: 0,
  eating: false,
}

const props = withDefaults(
  defineProps<{
    title: string
    data?: ModalData
  }>(),
  {
    data: () =>
      ({
        _id: '',
        name: '',
        building: '',
        capacity: 0,
        area: 0,
        eating: false,
      }) as ModalData,
  }
)
const emits = defineEmits<{
  submit: [data: ModalData]
}>()

const modalData = ref<ModalData>(defaultData)
const dialog = ref()

const dialogOpenHandler = () => {
  modalData.value = { ...toRefs(props).data.value }
}

const dialogCloseHandler = () => {
  blockButton.value = false
}

const afterDialogCloseHandler = () => {
  modalData.value = defaultData
}

const submitDialogHandler = () => {
  blockButton.value = true
  emits('submit', modalData.value)
}

const blockButton = ref(false)
</script>

<template>
  <Dialog
    ref="dialog"
    class="w-[25rem]"
    modal
    block-scroll
    @hide="dialogCloseHandler()"
    @after-hide="afterDialogCloseHandler()"
    @show="dialogOpenHandler()"
  >
    <template #header>
      <UiModalHeader>{{ props.title }}</UiModalHeader>
    </template>

    <template #default>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label>名稱</label>
          <InputText v-model="modalData.name"></InputText>
        </div>

        <div class="flex flex-col gap-1">
          <label>館別</label>
          <InputText v-model="modalData.building" />
        </div>

        <div class="flex flex-col gap-1">
          <label>員額</label>
          <InputText v-model="modalData.capacity" />
        </div>

        <div class="flex flex-col gap-1">
          <label>面積</label>
          <InputText v-model="modalData.area" />
        </div>

        <div class="flex items-center gap-x-2">
          <Checkbox v-model="modalData.eating" binary />
          <div>允許飲食</div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full flex gap-4">
        <Button
          class="w-full"
          label="取消"
          :severity="'secondary'"
          icon="pi pi-times"
          outlined
          :loading="blockButton"
          @click="() => dialog.close()"
        />
        <Button
          class="w-full"
          label="完成"
          icon="pi pi-check"
          :loading="blockButton"
          @click="submitDialogHandler()"
        />
      </div>
    </template>
  </Dialog>
</template>
