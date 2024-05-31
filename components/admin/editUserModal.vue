<script setup lang="ts">
import type Dialog from 'primevue/dialog'
import type { UserListItem } from '~/utils/useApi'

const props = withDefaults(
  defineProps<{
    title: string
    data?: UserListItem
  }>(),
  {
    data: () => defaultData,
  }
)
const emits = defineEmits<{
  submit: [data: UserListItem]
}>()

const dialog = ref()
const isButtonBlocked = ref(false)

const modalData = ref<UserListItem>(defaultData)

const modalOpenHandler = () => {
  modalData.value = { ...toRefs(props).data.value }
  isButtonBlocked.value = false
}
</script>

<script lang="ts">
export const defaultData: UserListItem = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  role: 'Admin',
}
</script>

<template>
  <Dialog
    ref="dialog"
    modal
    block-scroll
    class="w-[30rem]"
    @show="modalOpenHandler()"
  >
    <template #header>
      <UiModalHeader>{{ props.title }}</UiModalHeader>
    </template>

    <template #default>
      <div class="w-full flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col gap-1">
            <label>姓氏</label>
            <InputText v-model="modalData.lastName"></InputText>
          </div>
          <div class="flex flex-col gap-1">
            <label>名字</label>
            <InputText v-model="modalData.firstName" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label>電子信箱</label>
          <InputText v-model="modalData.email" />
        </div>

        <div class="flex flex-col gap-1">
          <label>帳號</label>
          <InputText v-model="modalData.username" />
        </div>

        <div class="flex flex-col gap-1">
          <label>密碼</label>
          <Password
            v-model="modalData.password"
            input-class="w-full"
            :feedback="false"
          />
        </div>

        <div class="flex flex-col gap-1">
          <div>權限</div>
          <div class="flex items-center">
            <div class="flex items-center">
              <RadioButton
                v-model="modalData.role"
                input-id="role_admin"
                name="role"
                value="Admin"
              />
              <label for="role_admin" class="ml-2">管理員</label>
            </div>
            <div class="flex items-center ml-4">
              <RadioButton
                v-model="modalData.role"
                input-id="role_user"
                name="role"
                value="User"
              />
              <label for="role_user" class="ml-2">一般使用者</label>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full flex gap-4">
        <div class="w-full flex gap-4">
          <Button
            class="w-full"
            label="取消"
            :severity="'secondary'"
            icon="pi pi-times"
            outlined
            :loading="isButtonBlocked"
            @click="() => dialog!.close()"
          />
          <Button
            class="w-full"
            label="完成"
            icon="pi pi-check"
            :loading="isButtonBlocked"
            @click="
              () => {
                emits('submit', modalData)
                isButtonBlocked = true
              }
            "
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
