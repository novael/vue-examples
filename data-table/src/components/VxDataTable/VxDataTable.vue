<template>
  <v-toolbar color="white">
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer/>
    <v-btn icon="mdi-dots-vertical" v-if="menu" aria-haspopup="true" title="Table Menu" />
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
    <div class="d-flex align-center">
      <div v-if="pagination" class="mr-8">
        <span>{{ rowsPerPageMsg }}</span>
        <div 
          class="count-selector" 
          tabindex="0" 
          :aria-label="rowsPerPageMsg"
          @keydown.enter="rowsPerPageMenu = !rowsPerPageMenu"
          aria-haspopup="true"
          ref="countSelector"
        >
          <span role="menuitem">{{ pageSize }}</span>
          <v-icon>mdi-chevron-down</v-icon>
          <v-menu activator="parent" v-model="rowsPerPageMenu" @keydown.esc="">
            <v-list>
              <v-list-item
                role="menuitem"
                v-for="it in itemsPerPage" 
                :value="it"
                @click="setPageSize(it)"
                @keydown.enter="setPageSize(it)"
                @keydown.up.prevent="($event) => moveFocusInMenu('up', 'v-list-item', $event)"
                @keydown.down.prevent="($event) => moveFocusInMenu('down', 'v-list-item',$event)"
              >
              {{ it }}
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <span :class="{ 'mr-8': pagination }">{{ currentSlice }} of {{ totalItems }}</span>
      <div class="pagination-buttons" v-if="pagination">
        <v-btn 
          title="Previous Page"
          @click="prevPage"
          class="mr-4"
          :disabled="currentPage == 1"
          icon="mdi-chevron-left" 
          size="small" 
          flat
        ></v-btn>
        <v-btn 
          title="Next Page"
          @click="nextPage"
          :disabled="currentPage == pageCount"
          icon="mdi-chevron-right" 
          size="small" 
          flat
        ></v-btn>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import { useSort } from './sort.js'

  const { DIR, sortDir, sortBy, setSort, getSortFn } = useSort();

  const emit = defineEmits(["update:pageChange", "row:select"]);

  const props = defineProps({
    title: { type: String, required: true },
    menu: Array,
    columns: { type: Array, required: true },
    rows:  { type: Array, required: true },
    pagination: [Boolean, String],
    itemsPerPage: { type: Array, default: [10,25,50] },
    total: { type: Number }
  });

  const rowsPerPageMsg = "Rows per page";
  const pageSize = props.pagination ? ref(props.itemsPerPage[0]) : props.rows.length;
  const currentPage = ref(1);
  const rowsPerPageMenu = ref(false);
  const countSelector = ref();
  const currentSlice = ref("0-0");
  const pageCount = computed(() => {
    return Math.ceil((!!props.total ? props.total : props.rows.length) / pageSize.value);
  })
  const totalItems = computed(() => {
    return props.total || props.rows.length;
  })

  const filteredRows = computed(() => {
    const base = pageSize.value * currentPage.value;
    const start = base - pageSize.value;
    const end = base < totalItems.value ? base : totalItems.value;

    if(props.pagination == true) {
      currentSlice.value = getSlice(start + 1, end);
      return [...props.rows]
        .sort(getSortFn(sortBy.value, sortDir.value))
        .slice(start, end);
    }
    else if(props.pagination == "server") {
        currentSlice.value = getSlice(start + 1, end);
        return props.rows;
    }
    else {
      currentSlice.value = getSlice(1, totalItems.value);
      return [...props.rows]
        .sort(getSortFn(sortBy.value, sortDir.value))
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

    /* close menu */
    if(rowsPerPageMenu.value) rowsPerPageMenu.value = false;

    /* return focus to menu activator */
    nextTick(() => {
      countSelector.value.focus();
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

  const moveFocusInMenu = (dir, cssClass, $event) => {
    const $el = $event.target;
    const $prev =  (
      $el.previousSibling && 
      $el.previousSibling.nodeType == Node.ELEMENT_NODE && 
      $el.previousSibling.classList.contains(cssClass)
    ) ? $el.previousSibling : null;

    const $next = (
      $el.nextSibling && 
      $el.nextSibling.nodeType == Node.ELEMENT_NODE && 
      $el.nextSibling.classList.contains(cssClass)
    ) ? $el.nextSibling : null;

    if(dir == 'up') {
      if($el && $prev) $prev.focus();
    }
    else if(dir == 'down') {
      if($el && $next) $next.focus();
    }
  }

  const getSlice = (start, end) => {
    return `${start}-${end}`;
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

  watch(rowsPerPageMenu, (val) => {
    if(val) {
      setTimeout(() => {
        document.querySelector(".v-overlay--active .v-list-item").focus();
      },300)
    }
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