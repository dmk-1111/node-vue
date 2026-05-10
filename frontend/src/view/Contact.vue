<script setup>
import Navbar from './Navbar.vue';
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import $ from 'jquery';

const $cookies = inject('$cookies')
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
    await getDataFromTable();
    token.value = localStorage.getItem('authToken')

    if (!token.value) {
        router.replace('/signin')
        return
    }
    await displayAllContacts();
});

const displayAllContacts = async () => {
    try {
        let response = await fetch('https://node-vue-gamma.vercel.app/_/backend/api/contact/all', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
            credentials: "include"
        })

        // handle unauthorized (token invalid/expired)
        if (response.status === 401) {
            await refreshToken() // try to refresh token
            response = await fetch('https://node-vue-gamma.vercel.app/_/backend/api/contact/all', {
                headers: {
                    'Authorization': `Bearer ${token.value}`
                },
                credentials: "include"
            })
        }
        const data = await response.json()
        contacts.value = data;
    } catch (err) {
        console.error('Error fetching contact data:', err)   
    }
}
async function refreshToken() {
  const res = await fetch("https://node-vue-gamma.vercel.app/_/backend/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if(res.status == 403){
    await alertMessage();
    return;
  }
  const data = await res.json();
  token.value = data.accessToken;
}

const alertMessage =  async () => {
    alert('Session expired. Please sign in again.');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    $cookies.remove('refreshToken');
    router.replace('/signin');
}
const getDataFromTable = async () => {
    $(() => {
        $('.table-responsive .table').on('click', '.btn-edit', function() {
            const id = $(this).data('id');
            const name = $(this).closest('tr').find('td.td_name').text();
            const email = $(this).closest('tr').find('td.td_email').text();
            const phone = $(this).closest('tr').find('td.td_phone').text();
            const detail = $(this).closest('tr').find('td.td_detail').text();
            $('#modalEdit #e_id').val(id);
            $('#modalEdit #e_name').val(name);
            $('#modalEdit #e_email').val(email);
            $('#modalEdit #e_phone').val(phone);
            $('#modalEdit #e_detail').val(detail);
        });
        $('.table-responsive .table').on('click', '.btn-del', function() {
            const id = $(this).data('id');
            $('#modalDelete #d_id').val(id);
        });
    });
}

const submitCreateContact = async (e) => {
    e.preventDefault();
    try{
        const {name, email, phone, detail} = newContact.value;
        const url = "https://node-vue-gamma.vercel.app/_/backend/api/contact/create";
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            },
            credentials: "include",
            body: JSON.stringify({ name, email, phone, detail })
        });
        if(response.status === 401) {
            await refreshToken() // try to refresh token
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                },
                credentials: "include",
                body: JSON.stringify({ name, email, phone, detail })
            });
        }
        if(response.ok) {
            alert('Contact created successfully!');
            setTimeout(() => {
                router.go(0); // Refresh the page to show the new contact
            }, 1000);
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
        const url = `https://node-vue-gamma.vercel.app/_/backend/api/contact/update/${id}`;
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            },
            credentials: "include",
            body: JSON.stringify({ name, email, phone, detail })
        });
        if(response.status === 401) {
            await refreshToken() // try to refresh token
            response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                },
                credentials: "include",
                body: JSON.stringify({ name, email, phone, detail })
            });
        }
        if(response.ok) {
            alert('Contact updated successfully!');
            setTimeout(() => {
                router.go(0); // Refresh the page to show the updated contact
            }, 1000);
        }
    }catch (err) {
        console.error('Error updating contact:', err)
    }
}

const submitDeleteContact = async (e) => {
    e.preventDefault();
    const id = $('#d_id').val();
    const url = `https://node-vue-gamma.vercel.app/_/backend/api/contact/delete/${id}`;
    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token.value}`
        },
        credentials: "include"
    });

    if(response.status === 401) {
        await refreshToken() // try to refresh token
        response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
            credentials: "include"
        });
    }

    if(response.ok) {
        alert('Contact deleted successfully!');
        setTimeout(() => {
            router.go(0); // Refresh the page to remove the deleted contact
        }, 1000);
    } else {
        alert('Failed to delete contact');
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