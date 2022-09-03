<template>
  <v-card class="ma-8 pa-4">
    <vx-data-table 
      title="NBA Teams"
      height="320"
      :menu="menuItems"
      :columns="columns"
      :rows="teams"
      :items-per-page="[10,25,50]"
      @row:click="(row) => details = row"
      pagination
    />
  </v-card>
  <v-card class="ma-8 pa-4">
    <v-btn @click="details = ''" class="mb-4" color="primary">Clear</v-btn>
    <pre>{{ details }}</pre>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import VxDataTable from './VxDataTable/VxDataTable.vue'

  const menuItems = [];
  const details = ref();
  const columns = [
    { text: "ID", value: "teamId", sortable: true },
    { text: "Name", value: "fullName", sortable: true },
    { text: "Conference", value: "confName", sortable: true },
    { text: "Division", value: "divName", sortable: true },
  ];
  const teams = ref([]);

  const baseUrl = "http://localhost:3000/teams";
  
  onMounted(async () => {
    const resp = await fetch(`${baseUrl}`);
    teams.value = await resp.json();
  })
</script>

<style scoped>

</style>