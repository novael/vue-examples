<template>
  <v-toolbar color="white">
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer/>
    <v-btn icon aria-haspopup="true" title="Table Menu" v-if="$slots.menu">
      <v-icon>mdi-dots-vertical</v-icon>
      <slot name="menu"></slot>
    </v-btn>
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
      <tr 
        v-for="row in filteredRows" 
        class="vx-data-table-row" 
        @click.stop.prevent="$emit('row:select', row)"
        @keydown.enter="$emit('row:select', row)"
        tabindex="0"
      >
        <td 
          class="pl-0" 
          v-for="col in columns" 
        >
          {{ row[col.value] }}
        </td>
      </tr>
    </tbody>
  </v-table>
  <footer class="d-flex pl-4 pt-4 text-body-2 align-center">
    <v-spacer></v-spacer>
    <vx-pagination 
      v-if="pagination"
      :remote="pagination.remote"
      :items-per-page="pagination.itemsPerPage"
      :total-items="total"
      @update:page-change="onPageChange"
    >
    </vx-pagination>
  </footer>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { useSort } from './sort.js'
  import VxPagination from './VxPagination.vue'

  const { DIR, sortDir, sortBy, setSort, getSortFn } = useSort();

  const emit = defineEmits(["row:select", "update:sortChange", "update:pageChange"])

  const props = defineProps({
    title: { type: String, required: true },
    columns: { type: Array, required: true },
    rows:  { type: Array, required: true },
    pagination: [Boolean, String, Object],
    total: { type: Number }
  });

  const pagination = computed(() => {
    if(!!props.pagination) {
      return {
        remote: (
          props.pagination === "remote" || props.pagination.remote === true
        ) ? true : false,
        itemsPerPage: (
          Array.isArray(props.pagination.itemsPerPage)
         ) ? props.pagination.itemsPerPage : [10,25,50]
      }
    }
    else {
      return false;
    }
  })

  const slice = ref({
    start: 0,
    end: pagination.value.itemsPerPage[0]
  })

  const filteredRows = computed(() => {
    if(!pagination.value) return [...props.rows].sort(getSortFn(sortBy.value, sortDir.value));

    if(pagination.value.remote) return props.rows;

    return [...props.rows]
      .sort(getSortFn(sortBy.value, sortDir.value))
      .slice(slice.value.start, slice.value.end);
  });

  const clickable = (sortable) => {
    return sortable ? 'click': null;
  }

  const onPageChange = (pageInfo) => {
    slice.value = pageInfo.slice;
    emit("update:pageChange", {
      pageSize: pageInfo.pageSize,
      page: pageInfo.page,
      slice: pageInfo.slice
    });
  }

  watch(sortBy, (val) => {
    emit("update:sortChange", {
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  })

  watch(sortDir, (val) => { 
    emit("update:sortChange", {
      sortBy: sortBy.value,
      sortDir: sortDir.value
    })
  })

</script>

<style scoped>
  footer {
    border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
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
  .vx-data-table-row {
    cursor: pointer;
  }
  .vx-data-table-row:focus {
    background-color: rgba(var(--v-border-color), var(--v-border-opacity));
  }
  .vx-data-table-row:focus-visible {
    outline: none;
  }
</style>