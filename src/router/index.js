import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './../components/Login/Login.vue'
import Home from './../components/Home.vue'

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {

// })

export default router
