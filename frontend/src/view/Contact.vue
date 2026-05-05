<script setup>
import Navbar from './Navbar.vue';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const title = ref('')
const token = ref('')

onMounted(async () => {
    token.value = localStorage.getItem('authToken')

    if (!token.value) {
        router.replace('/signin')
        return
    }

    try {
        const res = await fetch('http://localhost:8080/api/contact/health', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })

        // handle unauthorized (token invalid/expired)
        if (res.status === 401) {
            localStorage.removeItem('authToken')
            router.replace('/signin')
            return
        }

        const data = await res.json()
        title.value = data.message

    } catch (err) {
        console.error('Error fetching contact data:', err)
    }
})
</script>

<template>
    <div class="contact">
        <Navbar />
        <h1>Contact Us</h1>
        <p v-if="title">{{ title }}</p>
    </div>
</template>