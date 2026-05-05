<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loggedInUser = ref(null)
const token = ref(null)

onMounted(() => {
  loggedInUser.value = localStorage.getItem('userName')
  token.value = localStorage.getItem('authToken')
  if(token.value) {
    console.log('User is logged in:', loggedInUser.value)
  } else {
    console.log('No user logged in, redirecting to login page')
    router.push('/signin')
  }
})

const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userName')

  setTimeout(() => {
    router.push('/signin')
  }, 1000)
}
</script>
<template>
    <nav class="navbar">
      <div class="navbar-brand" v-if="loggedInUser">
        <router-link to="/home" class="username">{{ loggedInUser }}</router-link>
      </div>
      <ul class="navbar-menu">
        <li>
          <router-link to="/contact">Contact</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
        <li><a href="#" @click.prevent="handleLogout" class="logout">Logout</a></li>
      </ul>
    </nav>
</template>
<style>
.navbar {
  background: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.navbar-menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar-menu a:hover {
  color: #42b883;
}

.navbar-menu a.logout {
  color: #ff6b6b;
}

.navbar-menu a.logout:hover {
  color: #ff5252;
}
.username{
    text-decoration: none;
    color: white;
}
</style>