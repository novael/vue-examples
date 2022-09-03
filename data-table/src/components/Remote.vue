<template>
  <v-card class="ma-8 pa-4">
    <vx-data-table 
      title="NBA Teams"
      :menu="menuItems"
      :columns="columns"
      :rows="teams"
      :items-per-page="[10,25,50]"
      :total="totalCount"
      @update:page-change="onPageChange"
      pagination="server"
    />
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import VxDataTable from './VxDataTable/VxDataTable.vue'

  const menuItems = [];
  const totalCount = ref(0);
  const columns = [
    { text: "ID", value: "teamId", sortable: true },
    { text: "Name", value: "fullName", sortable: true },
    { text: "Conference", value: "confName", sortable: true },
    { text: "Division", value: "divName", sortable: true },
  ];
  const teams = ref([]);

  const baseUrl = "http://localhost:3000/teams";
  
  onMounted(async () => {
    const resp = await fetch(`${baseUrl}?_page=1&_limit=10`);
    const rowCount = Number(resp.headers.get("X-Total-Count"));
    teams.value = await resp.json();
    totalCount.value = rowCount;
  })

  const onPageChange = async (pageData) => {
    const resp = await fetch(`${baseUrl}?_page=${pageData.page}&_limit=${pageData.pageSize}&_sort=${pageData.sortBy}&_order=${pageData.sortDir}`);
    const rowCount = Number(resp.headers.get("X-Total-Count"));
    teams.value = await resp.json();
    totalCount.value = rowCount;
  }

</script>

<style scoped>

</style>