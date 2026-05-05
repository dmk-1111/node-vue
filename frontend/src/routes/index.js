import { createRouter, createWebHistory } from 'vue-router'
import Home from '../view/Home.vue'
import Signin from '../view/signin/SignIn.vue'
import Contact from '../view/Contact.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/signin' 
  },
  {
    path: '/home',
    component: Home
  },
  { 
    path: '/signin', 
    component: Signin 
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/about',
    component: () => import('../view/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router