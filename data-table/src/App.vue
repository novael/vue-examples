<template>
  <v-app>
    <v-main>
      <v-card class="ma-8 pa-4">
        <vx-data-table 
          title="NBA Teams"
          :menu="menuItems"
          :columns="columns"
          :rows="teams"
          select-rows-per-page
          pagination
        />
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import VxDataTable from './components/VxDataTable/VxDataTable.vue'

  const menuItems = [];
  const columns = [
    { text: "ID", value: "teamId", sortable: true },
    { text: "Name", value: "fullName", sortable: true },
    { text: "Conference", value: "confName", sortable: true },
    { text: "Division", value: "divName", sortable: true },
  ];
  const teams = ref([]);
  
  onMounted(async () => {
    const resp = await fetch("http://localhost:3000/teams");
    teams.value = await resp.json();
  })

</script>
