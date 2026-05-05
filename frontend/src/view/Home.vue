<script setup>
import Navbar from './Navbar.vue';
</script>

<template>
  <div class="home">
    <Navbar />
    <main class="body">
      <h1>Hello</h1>
    </main>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
}
</style>
