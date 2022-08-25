<template>
  <div class="profile-card">
    <div class="profile-image">
      <img />
    </div>
    <div class="profile-info">
      <span></span>
      <h3></h3>
      <p></p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
  .profile-image img {
    width: 100%;
    background-color: #eee;
  }

  .profile-info span {
    width: 100px;
    height: 16px;
    display: block;
    /* background-color: #eee; */
    animation: pulse-bg 1s infinite;
  }

  .profile-info h3 {
    width: 250px;
    height: 24px;
    /* background-color: #eee; */
    animation: pulse-bg 1s infinite;
  }
  
  .profile-info p {
    width: 450px;
    height: 16px;
    /* background-color: #eee; */
    animation: pulse-bg 1s infinite;
  }

  @keyframes pulse-bg {
    0% {
      background-color: #eee;
    }
    50% {
      /* background-color: #eaeaea; */
      background-color: #e1e1e1;
    }
    100% {
      background-color: #eee;
    }
  }
</style>