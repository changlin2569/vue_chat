import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './../components/Login/Login.vue'
import Home from './../components/Home.vue'
import MsgList from './../components/MsgList/MsgList.vue'
import Friends from './../components/Friends/Friends.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/msgList',
        component: MsgList
      },
      {
        path: '/friends',
        component: Friends
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {

// })

export default router
