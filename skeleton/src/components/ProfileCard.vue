<template>
  <div class="profile-card">
    <div class="profile-image">
      <img :src="userData.pic">
    </div>
    <div class="profile-info">
      <span>Written By: </span>
      <h3>{{ userData.name }}</h3>
      <p>{{ userData.bio }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const loadUserData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "Leavon Parrish",
          pic: "https://www.nicekicks.com/files/2020/06/air-jordan-jumpman-logo.jpg",
          bio: "I'm a full stack developer, husband, father, and hooper."
        })
      }, 2000)
    })
  }

  const userData = ref(await loadUserData());

</script>

<style>

.profile-card {
  background-color: white;
  max-width: 700px;
  min-height: 180px;
  display: flex;
  border-radius: 10px;
}
.profile-image {
  height: 100px;
  width: 100px;
  margin: 2em;
}

.profile-image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.profile-info {
  padding-top: 2em;
}

.profile-info span {
  text-transform: uppercase;
  color: #777;
}
</style>