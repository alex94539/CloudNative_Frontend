<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    accept?: string
    icon?: string
  }>(),
  {
    label: '上傳檔案',
    accept: '',
    icon: 'pi pi-upload',
  }
)
const emits = defineEmits<{
  change: [Event]
}>()
const fileList = defineModel<FileList>()
const inputFile = ref<HTMLInputElement>()

const updateFileList = () => {
  if (inputFile.value && inputFile.value.files) {
    fileList.value = inputFile.value.files
  }
}
const isFileSelected = computed(() => {
  return fileList.value !== undefined && fileList.value.length > 0
})
const label = computed(() => {
  if (isFileSelected.value) return '重新選擇'
  return props.label
})

const fileNames = computed(() => {
  fileList.value
  if (!isFileSelected.value) return []

  return Array.from(inputFile.value!.files!).map((v) => v.name)
})

const removeItem = (index: number) => {
  if (inputFile.value === undefined) return

  const dt = new DataTransfer()

  Array.from(inputFile.value.files!).forEach((v, i) => {
    if (i !== index) dt.items.add(v)
  })

  inputFile.value.files = dt.files
  updateFileList()
}
</script>

<template>
  <div>
    <Button :icon="props.icon" :label @click="inputFile?.click()" />
    <input
      ref="inputFile"
      type="file"
      :accept
      class="hidden"
      @change="
        ($event) => {
          emits('change', $event)
          updateFileList()
        }
      "
    />
    <div class="flex gap-2 mt-2">
      <Chip
        v-for="(items, index) in fileNames"
        :key="index"
        :label="items"
        removable
        @remove="removeItem(index)"
      />
    </div>
  </div>
</template>
