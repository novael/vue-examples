<template>
  <v-card class="ma-8 pa-4">
    <vx-data-table 
      title="NBA Teams"
      height="360"
      :columns="columns"
      :rows="teams"
      :total="totalCount"
      @row:select="onRowSelected"
      pagination
    >
      <template #menu> <!-- using slot to define a header menu -->
        <v-menu activator="parent">
          <v-list>
            <v-list-item :value="1">1</v-list-item>
            <v-list-item :value="2">2</v-list-item>
            <v-list-item :value="3">3</v-list-item>
          </v-list>
        </v-menu>
      </template>
    </vx-data-table>
  </v-card>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import VxDataTable from './VxDataTable/VxDataTable.vue'

  const columns = [
    { text: "ID", value: "teamId", sortable: true },
    { text: "Name", value: "fullName", sortable: true },
    { text: "Conference", value: "confName", sortable: true },
    { text: "Division", value: "divName", sortable: true },
  ];
  const teams = ref([]);
  const totalCount = ref(0);
  const baseUrl = "http://localhost:3000/teams";
  
  onMounted(async () => {
    const resp = await fetch(`${baseUrl}`);
    teams.value = await resp.json();
    totalCount.value = teams.value.length;
  })

  const onRowSelected = (row) => (console.log(row))
</script>