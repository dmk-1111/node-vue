<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const isSignup = ref(false)
const signup = ref({ name: '', email: '', password: '' })
const signin = ref({ email: '', password: '' })
const message = ref('')
const $cookies = inject('$cookies')

const submitSignup = async (e) => {
  e.preventDefault();
  const { name, email, password } = signup.value;
  const url = 'https://node-vue-gamma.vercel.app/_/backend/api/auth/signup';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify({ name, email, password })
  });
  const result = await response.json();
  const { message, token, refreshToken, userLogged, _id } = result;
  if (response.ok) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', userLogged);
    $cookies.set('_id', _id, '1d');
    $cookies.set('refreshToken', refreshToken, '1d');
    alert(`${message}`);
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  } else {
    alert(`Signup failed: ${message}`);
    console.error('Signup error', result);
  }
}

const submitSignin = async (e) => {
  e.preventDefault();
  const { email, password } = signin.value;
  const url = 'https://node-vue-gamma.vercel.app/_/backend/api/auth/signin';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });
  const result = await response.json();
  const { message, token, refreshToken, name, _id } = result;
  if (response.ok) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    $cookies.set('_id', _id, '1d');
    $cookies.set('refreshToken', refreshToken, '1d');
    alert(`${message}`);
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  } else {
    alert(`Signin failed: ${message}`);
    console.error('Signin error', result);
  }
}

const toggleForm = (showSignup) => {
  isSignup.value = showSignup
}
</script>

<template>
  <div class="container">
    <h1>Authentication</h1>

    <div class="toggle-buttons">
      <button 
        :class="{ active: !isSignup }" 
        @click="toggleForm(false)"
      >
        Signin
      </button>
      <button 
        :class="{ active: isSignup }" 
        @click="toggleForm(true)"
      >
        Signup
      </button>
    </div>

    <section v-if="!isSignup" class="card">
      <h2>Signin</h2>
      <form @submit.prevent="submitSignin">
        <label>
          Email
          <input v-model="signin.email" type="email" required />
        </label>

        <label>
          Password
          <input v-model="signin.password" type="password" required />
        </label>

        <button type="submit">Signin</button>
      </form>
    </section>

    <section v-if="isSignup" class="card">
      <h2>Signup</h2>
      <form @submit.prevent="submitSignup">
        <label>
          Name
          <input v-model="signup.name" type="text" required />
        </label>

        <label>
          Email
          <input v-model="signup.email" type="email" required />
        </label>

        <label>
          Password
          <input v-model="signup.password" type="password" required />
        </label>

        <button type="submit">Signup</button>
      </form>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  margin: 0 0 1rem;
}

.toggle-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.toggle-buttons button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #ccc;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.toggle-buttons button.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.card {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.25rem;
}

form {
  display: grid;
  gap: 0.75rem;
}

label {
  display: grid;
  gap: 0.25rem;
  font-weight: 600;
}

input {
  padding: 0.65rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button[type="submit"] {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
  cursor: pointer;
  font-weight: 700;
}

button[type="submit"]:hover {
  background: #36966f;
}

.message {
  padding: 0.75rem 1rem;
  background: #eef8e7;
  border: 1px solid #c7e5c7;
  border-radius: 6px;
}
</style>
