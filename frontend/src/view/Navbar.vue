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
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <router-link to="/home" class="navbar-brand username d-flex align-items-center"><i class="bi bi-person-circle fs-5"></i>&nbsp;&nbsp;{{ loggedInUser }}</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="p-0 px-2 fs-5 nav-link" to="/contact">Contact</router-link>
            </li>
            <li class="nav-item">
              <router-link class="p-0 px-2 fs-5 nav-link" to="/about">About</router-link>
            </li>
          </ul>
          <a href="#" @click.prevent="handleLogout" class="logout btn btn-outline-danger"><i class="bi bi-box-arrow-right"></i>&nbsp;Logout</a>
        </div>
      </div>
    </nav>
</template>
<style>
.navbar {
  background: linear-gradient(90deg,#58abd8,white);
  color: #fff;
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