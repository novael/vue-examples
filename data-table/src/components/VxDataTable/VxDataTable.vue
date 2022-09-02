<template>
  <v-toolbar color="white">
    <v-app-bar-nav-icon class="ml-0" v-if="menu"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
  </v-toolbar>
  <v-table 
    class="pl-4" 
    v-bind="$attrs"
    density="compact" 
    fixed-header>
    <thead>
      <tr class="text-left">
        <th 
          v-for="col in columns"
          role="columnheader"
          :aria-label="col.text"
          class="pl-0 text-subtitle-2"
          :class="{ sortable: col.sortable, active: sortDir !== DIR.NONE && sortBy == col.value, asc: sortDir == DIR.ASC, desc: sortDir == DIR.DESC }"
          @[clickable(col.sortable)]="setSort(col.value)"
        >
          <span>{{ col.text }}</span>
          <span v-if="col.sortable"><v-icon>mdi-chevron-up</v-icon></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in filteredRows">
        <td class="pl-0" v-for="col in columns">{{ row[col.value] }}</td>
      </tr>
    </tbody>
  </v-table>
  <footer class="d-flex pl-4 pt-4 text-body-2 align-center" v-if="pagination">
    <div>
      <span>Rows per page</span>
      <div class="count-selector">{{ pageSize }}
        <v-icon>mdi-chevron-down</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item 
              v-for="it in itemsPerPage" 
              :value="it"
              @click="setPageSize(it)"
            >
            {{ it }}
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-spacer></v-spacer>
    <div class="pagination">
      <span class="mr-8">Page {{ currentPage }} of {{ pageCount }}</span>
      <v-btn 
        @click="prevPage"
        class="mr-4" 
        :disabled="currentPage == 1"
        icon="mdi-chevron-left" 
        size="small" 
        flat
      ></v-btn>
      <v-btn 
        @click="nextPage"
        :disabled="currentPage == pageCount"
        icon="mdi-chevron-right" 
        size="small" 
        flat
      ></v-btn>
    </div>
  </footer>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { useSort } from './sort.js'

  const { DIR, sortDir, sortBy, setSort, getSortFn } = useSort();

  const emit = defineEmits(["update:pageChange"]);

  const props = defineProps({
    title: { type: String, required: true },
    menu: Array,
    columns: { type: Array, required: true },
    rows:  { type: Array, required: true },
    pagination: [Boolean, String],
    itemsPerPage: { type: Array, default: [10,25,50] },
    total: { type: Number }
  });

  const pageSize = props.pagination ? ref(props.itemsPerPage[0]) : props.rows.length;
  const currentPage = ref(1);
  const pageCount = computed(() => {
    return Math.ceil((!!props.total ? props.total : props.rows.length) / pageSize.value);
  })

  const filteredRows = computed(() => {
    if(props.pagination == true){
      const base = pageSize.value * currentPage.value;
      const start = base - pageSize.value;
      const end = base < props.rows.length ? base : props.rows.length;
      if(sortDir.value == DIR.ASC) {
        return [...props.rows]
          .sort(getSortFn(sortBy.value, DIR.ASC))
          .slice(start, end)
      }
      else if(sortDir.value == DIR.DESC) {
        return [...props.rows]
          .sort(getSortFn(sortBy.value, DIR.DESC))
          .slice(start, end)
      }
      else {
        return props.rows.slice(start, end);
      }
    }
    else if(props.pagination == "server") {
        return props.rows;
    }
    else {
      return props.rows;
    }
  });

  const clickable = (sortable) => {
    return sortable ? 'click': null;
  }

  const setPageSize = (val) => {
    currentPage.value = 1; //reset current page
    pageSize.value = val;

    emit("update:pageChange", { 
      pageSize: pageSize.value, 
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  }

  const prevPage = () => {
    if(currentPage.value > 1) currentPage.value--;
    emit("update:pageChange", { 
      pageSize: pageSize.value, 
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  }

  const nextPage = () => {
    if(currentPage.value < pageCount.value) currentPage.value++;
    emit("update:pageChange", { 
      pageSize: pageSize.value, 
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  }

  watch(sortBy, (val) => {
    emit("update:pageChange", { 
      pageSize: pageSize.value, 
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  })

  watch(sortDir, (val) => {
    emit("update:pageChange", { 
      pageSize: pageSize.value, 
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  })
</script>

<style scoped>
  footer {
    border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
  .count-selector {
    display: inline-block;
    cursor: pointer;
    margin: 0 8px;
    padding: 2px 4px;
    border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
  .sortable {
    cursor: pointer;
  }
  .sortable i {
    color: rgba(0,0,0,0);
  }
  .sortable.active i {
    color: rgba(0,0,0,0.87);
    transition: color ease-in 0.3s;
  }
  .sortable.active:hover i {
    color: rgba(0,0,0,0.87);
  }
  .sortable:hover i {
    transform: rotate(0deg);
    color: rgba(0,0,0,0.50);
    transition: color ease-in 0.3x;
    transition: transform 0.2s linear;
  }
  .sortable.active.asc i {
    transform: rotate(0deg);
    transition: transform 0.2s linear;
  }
  .sortable.active.desc i {
    transform: rotate(180deg);
    transition: transform 0.2s linear;
  }
  .inactive-chevron {
    color: rgba(0,0,0,0.33);
  }
</style>