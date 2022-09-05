# Data-table Implementation

This is a data-table extension of the Vuetify table for Vue 3.  This data-table supports local and remote pagination, as well as local and remote sorting.

## Examples

### Simple table
```
<template>
  <vx-data-table
    title="NBA Teams"
    :columns="columns" 
    :rows="rows"
    :total="totalCount"
  />
</template>
<script setup>
  import VxDataTable from '@/components/VxDataTable/VxDataTable'

  const columns = [
    { text: "Name", value: "teamName" },
    { text: "Conference", value: "confName" }
  ];

  const rows = [
    { teamName: "Washington Wizards", confName: "Eastern"},
    ...
  ];

  const totalCount = rows.length;
</script>
```

### Pagination
To add pagination to a local data source, simple add a pagination prop:
```
<vx-data-table ... pagination />
```
This will render pagination buttons, row count, and a selector for how many rows to display per page, defaulting to 10,25, and 50.  Here are additional options:

- **pagination**: Boolean | "remote" | Object (see pagination object)
- *pagination object*:
  - remote: Boolean (*default is false*)
  - itemsPerPage: Array (*default is [10,25,50]*)

> Note: The table will render the pagination component, but the fetching of the pages remotely should be handled by the consumer of the component.

### Sorting
To add sorting, simply add `sortable:true` to the column definition array:
```
const columns = [
  { text: "Team Name", value: "teamName", sortable: true }
]
```
### Events

| Event      | Payload    |
| -----------| -----------|
| row:select | { rowData }    |
| update:sortChange | { sortBy:String, sortDir:String ['asc','desc','none'] } |
| update:pageChange | { pageSize:Number, page:Number, slice:{ start:Number, end: Number} }
---
> Props of the [Vuetify table](https://next.vuetifyjs.com/en/api/v-table/) are applicable.