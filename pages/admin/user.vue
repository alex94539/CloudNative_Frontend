<script setup lang="ts">
const userListApi = await apiGetUserList()
const { data: userList, pending } = userListApi

const selectedRow = ref(0)
</script>

<template>
  <div>
    <DataTable :value="userList" :loading="pending">
      <Column header="序號" header-class="w-16">
        <template #body="slotProps">
          {{ slotProps.index }}
        </template>
      </Column>
      <Column header="姓" field="lastName"></Column>
      <Column header="名" field="firstName"></Column>
      <Column header="帳號" field="username">
        <template #body="slotProps">
          <i
            v-if="slotProps.data.role === 'Admin'"
            class="pi pi-crown"
            style="color: var(--primary-color)"
          />
          {{ slotProps.data.username }}
        </template>
      </Column>
      <Column header="電子信箱" field="email"></Column>
      <!-- TODO: hide it until we have patch user info api -->
      <!-- <Column header="操作">
        <template #body="slotProps">
          <div class="flex">
            <Button
              icon="pi pi-pencil"
              @click="
                () => {
                  selectedRow = slotProps.index
                }
              "
            />
          </div>
        </template>
      </Column> -->
    </DataTable>
  </div>
</template>
