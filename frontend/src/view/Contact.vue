<script setup>
import Navbar from './Navbar.vue';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const contacts = ref('')
const token = ref('')
const newContact = ref({
    name: '',
    email: '',
    phone: '',
    detail: ''
})

onMounted(async () => {
    token.value = localStorage.getItem('authToken')

    if (!token.value) {
        router.replace('/signin')
        return
    }

    try {
        const res = await fetch('http://localhost:8080/api/contact/all', {
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
        contacts.value = data;
        console.log('Fetched contact data:', contacts.value)

    } catch (err) {
        console.error('Error fetching contact data:', err)   
    }
})

const submitCreateContact = async (e) => {
    e.preventDefault();
    try{
        const {name, email, phone, detail} = newContact.value;
        const url = "http://localhost:8080/api/contact/create";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            },
            body: JSON.stringify({ name, email, phone, detail })
        });
        if(response.ok) {
            alert('Contact created successfully!');
            setTimeout(() => {
                router.go(0); // Refresh the page to show the new contact
            }, 1000);
        } else {
            const errorData = await response.json();
            alert(`Failed to create contact: ${errorData.message}`);
        }
    }catch (err) {
        console.error('Error creating contact:', err)
    }
}

const submitEditContact = async (e) => {
    e.preventDefault();
    try{
        const {name, email, phone, detail} = newContact.value;
        const url = `http://localhost:8080/api/contact/update/${newContact.value._id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            },
            body: JSON.stringify({ name, email, phone, detail })
        });
        if(response.ok) {
            alert('Contact updated successfully!');
            setTimeout(() => {
                router.go(0); // Refresh the page to show the updated contact
            }, 1000);
        } else {
            const errorData = await response.json();
            alert(`Failed to update contact: ${errorData.message}`);
        }
    }catch (err) {
        console.error('Error updating contact:', err)
    }
}
</script>

<template>
    <div class="contact">
        <Navbar />
        <div class="container">
            <div class="row">
                <div class="d-flex justify-content-between align-items-center mt-5">
                    <h4>Contact Information</h4>
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalCreate">+ New</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover mt-4">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Detail</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(contact, index) in contacts" :key="contact._id">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ contact._id }}</td>
                                <td>{{ contact.name }}</td>
                                <td>{{ contact.email }}</td>
                                <td>{{ contact.phone }}</td>
                                <td>{{ contact.detail }}</td>
                                <td colspan="2" class="d-flex gap-2">
                                    <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalEdit"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="modalCreate" tabindex="-1" aria-labelledby="modalCreateLabel" aria-hidden="true">
            <form @submit.prevent="submitCreateContact">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modalCreateLabel">New Contact</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">                            
                            <div class="form-group mb-3">
                                <label for="name">Name<span class="text-danger">*</span></label>
                                <input v-model="newContact.name" id="name" class="form-control" type="text" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="email">Email</label>
                                <input v-model="newContact.email" id="email" class="form-control" type="email" />
                            </div>
                            <div class="form-group mb-3">
                                <label for="phone">Phone<span class="text-danger">*</span></label>
                                <input v-model="newContact.phone" id="phone" class="form-control" type="text" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="detail">Detail</label>
                                <textarea v-model="newContact.detail" id="detail" class="form-control"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal fade" id="modalEdit" tabindex="-1" aria-labelledby="modalEditLabel" aria-hidden="true">
            <form @submit.prevent="submitEditContact">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modalEditLabel">Edit Contact</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">                            
                            <div class="form-group mb-3">
                                <label for="name">Name<span class="text-danger">*</span></label>
                                <input v-model="newContact.name" id="name" class="form-control" type="text" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="email">Email</label>
                                <input v-model="newContact.email" id="email" class="form-control" type="email" />
                            </div>
                            <div class="form-group mb-3">
                                <label for="phone">Phone<span class="text-danger">*</span></label>
                                <input v-model="newContact.phone" id="phone" class="form-control" type="text" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="detail">Detail</label>
                                <textarea v-model="newContact.detail" id="detail" class="form-control"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>