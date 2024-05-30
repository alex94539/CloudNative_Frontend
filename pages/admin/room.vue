<script setup lang="ts">
const { data } = await apiGetRoomList()
</script>
<template>
  <div>
    <DataTable :value="data" tableStyle="min-width: 50rem">
      <Column field="name" header="名稱"></Column>
      <Column field="building" header="館別"></Column>
      <Column header="操作">
        <template #body="slotProps">
          <div class="flex gap-x-2">
            <Button @click="slotProps.index" icon="pi pi-pencil" />
            <Button :severity="'danger'" icon="pi pi-trash" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
