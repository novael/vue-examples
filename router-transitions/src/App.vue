<script setup>
</script>

<template>
  <div class="content" id="app">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/guide">Guide</RouterLink>
    <RouterView v-slot="{ Component }">
      <Transition name="fade">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.content {
  width: 40%;
  min-width: 500px;
  margin: 0 auto;
  position: relative;
}

a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin-right: 1em;
}

a:hover,a.router-link-active {
  border-bottom: 2px solid #3498db;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>
