<template>
  <div class="d-flex align-center">
    <div class="mr-8">
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
    <span class="mr-8">{{ sliceText }} of {{ totalItems }}</span>
    <div class="pagination-buttons">
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

</template>

<script setup>
  import { ref, computed, nextTick, watch, onMounted } from 'vue'

  const emit = defineEmits(["update:pageChange"]);
  const props = defineProps({
    remote: {
      type: Boolean,
      default: false
    },
    itemsPerPage: { type: Array, default: [10,25,50] },
    totalItems: { type: Number }
  })

  const rowsPerPageMsg = "Rows per page";
  const pageSize = ref(props.itemsPerPage[0]);
  const rowsPerPageMenu = ref(false)
  const currentPage = ref(1);
  const countSelector = ref();

  const pageCount = computed(() => {
    return Math.ceil(props.totalItems / pageSize.value);
  })

  const slice = computed(() => {
    const base = pageSize.value * currentPage.value;
    const start = base - pageSize.value;
    const end = base < props.totalItems ? base : props.totalItems;

    // console.log("start", start)
    // console.log("end", end)

    return { start, end };
  })

  const sliceText = computed(() => {
    const { start, end } = slice.value;
    return `${start + 1}-${end}`;
  })

  const setPageSize = (val) => {
    currentPage.value = 1; //reset current page
    pageSize.value = val;

    /* close menu */
    if(rowsPerPageMenu.value) rowsPerPageMenu.value = false;

    /* return focus to menu activator */
    nextTick(() => {
      countSelector.value.focus();
    })
  }

  const prevPage = () => {
    if(currentPage.value > 1) currentPage.value--;
  }

  const nextPage = () => {
    if(currentPage.value < pageCount.value) currentPage.value++;
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

  watch(rowsPerPageMenu, (val) => {
    if(val) {
      setTimeout(() => {
        document.querySelector(".v-overlay--active .v-list-item").focus();
      },300)
    }
  })

  watch(slice, (val) => {
    emit("update:pageChange", { 
      pageSize: pageSize.value, 
      page: currentPage.value,
      slice: slice.value,
    })
  })

</script>

<style scoped>
  .count-selector {
    display: inline-block;
    cursor: pointer;
    margin: 0 8px;
    padding: 2px 4px;
    border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
</style>