<template>
  <v-app>
    <v-main>
      <div class="d-flex mt-8 justify-center">
        <v-btn flat to="/" :active="currentPage == 0">Local</v-btn>
        <v-btn flat to="/remote" :active="currentPage == 1">Remote</v-btn>
      </div>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const currentPage = computed(() => {
    return router.currentRoute.value.path == "/" ? 0 : 1
  })
</script>
