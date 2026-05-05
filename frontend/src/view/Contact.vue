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
        <div class="container">
            <div class="d-flex justify-content-between align-items-center mt-5">
                <h4>Contact Information</h4>
                <button class="btn btn-primary btn-sm">+ New</button>
            </div>
            <table class="table table-striped table-hover mt-4">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td>John</td>
                    <td>Doe</td>
                    <td>@social</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>