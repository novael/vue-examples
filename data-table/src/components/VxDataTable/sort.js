import { ref } from 'vue'

export function useSort() {
  const DIR = { 
    ASC: 'asc',
    DESC: 'desc',
    NONE: 'none'
  };
  const sortDir = ref(DIR.NONE);
  const sortBy = ref("");

  const setSort = (field) => {
    if(sortBy.value !== field) {
      sortDir.value = getSortDir(DIR.NONE);
    }
    else {
      sortDir.value = getSortDir(sortDir.value);
    }

    sortBy.value = field;
  };

  const getSortDir = (dir) => {
    if(dir == DIR.NONE) return DIR.ASC;
    if(dir == DIR.ASC) return DIR.DESC;
    if(dir == DIR.DESC) return DIR.NONE;
  }

  const getSortFn = (field, dir) => {
    return (a, b) => {
      if(dir == DIR.ASC) {
        if(a[field] > b[field]) return 1
        if(a[field] < b[field]) return -1
        return 0;
      }

      if(dir == DIR.DESC) {
        if(b[field] > a[field]) return 1
        if(b[field] < a[field]) return -1
        return 0;
      }
    }
  }

  return { DIR, sortDir, sortBy, setSort, getSortFn }
}