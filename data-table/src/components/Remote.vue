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
      @update:sort-change="onSortChange"
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
  const page = ref(1)
  const pageSize = ref(10);
  const sortBy = ref("");
  const sortDir = ref("");

  const baseUrl = "http://localhost:3000/teams";
  
  onMounted(async () => {
    await fetchData();
  })

  const onPageChange = async (pageData) => {
    page.value = pageData.page;
    pageSize.value = pageData.pageSize;
  
    await fetchData();
  }

  const onSortChange = async (sortData) => {
    sortBy.value = sortData.sortBy;
    sortDir.value = sortData.sortDir;

    await fetchData();
  }

  const fetchData = async () => {
    const resp = await fetch(`${baseUrl}?_page=${page.value}&_limit=${pageSize.value}&_sort=${sortBy.value}&_order=${sortDir.value}`);
    const rowCount = Number(resp.headers.get("X-Total-Count"));
    teams.value = await resp.json();
    totalCount.value = rowCount;
  }

</script>

<style scoped>

</style>