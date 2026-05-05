<script setup>
import Navbar from './Navbar.vue';
import '../assets/js/contact.js';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import $ from 'jquery';

const router = useRouter()
const contacts = ref('')
const token = ref('')
const newContact = ref({
    name: '',
    email: '',
    phone: '',
    detail: ''
})

const editContact = ref({
    _id: '',
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
        const id = $('#e_id').val();
        const name = $('#e_name').val();
        const email = $('#e_email').val();
        const phone = $('#e_phone').val();
        const detail = $('#e_detail').val();
        const url = `http://localhost:8080/api/contact/update/${id}`;
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

const submitDeleteContact = async (e) => {
    e.preventDefault();
    const id = $('#d_id').val();
    const url = `http://localhost:8080/api/contact/delete/${id}`;
    await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    })
    .then(response => {
        if(response.ok) {
            alert('Contact deleted successfully!');
            setTimeout(() => {
                router.go(0); // Refresh the page to remove the deleted contact
            }, 1000);
        } else {
            alert('Failed to delete contact');
        }
    })
    .catch(err => {
        console.error('Error deleting contact:', err)
    })
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
                                <td class="td_name">{{ contact.name }}</td>
                                <td class="td_email">{{ contact.email }}</td>
                                <td class="td_phone">{{ contact.phone }}</td>
                                <td class="td_detail">{{ contact.detail }}</td>
                                <td colspan="2" class="d-flex gap-2">
                                    <button class="btn btn-outline-primary btn-sm btn-edit" :data-id="contact._id" data-bs-toggle="modal" data-bs-target="#modalEdit"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm btn-del" :data-id="contact._id" data-bs-toggle="modal" data-bs-target="#modalDelete"><i class="bi bi-trash"></i></button>
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
                            <input type="hidden" name="_id" id="e_id" />                          
                            <div class="form-group mb-3">
                                <label for="name">Name<span class="text-danger">*</span></label>
                                <input id="e_name" class="form-control" type="text" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="email">Email</label>
                                <input id="e_email" class="form-control" type="email" />
                            </div>
                            <div class="form-group mb-3">
                                <label for="phone">Phone<span class="text-danger">*</span></label>
                                <input id="e_phone" class="form-control" type="text" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="detail">Detail</label>
                                <textarea id="e_detail" class="form-control"></textarea>
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
        <div class="modal fade" id="modalDelete" tabindex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true">
            <form @submit.prevent="submitDeleteContact">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modalDeleteLabel">Delete Contact</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">  
                            <input type="hidden" name="_id" id="d_id" />                          
                            <p>Are you sure you want to delete this contact?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>