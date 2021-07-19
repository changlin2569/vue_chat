import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
// import VueSocketIO from 'vue-socket.io'
// import io from 'socket.io-client'
// const socket = io('http://localhost:8083')

// 设置请求默认地址
axios.defaults.baseURL = 'http://localhost:3001'
// 设置请求拦截器
axios.interceptors.request.use(config => {
    const token = window.sessionStorage.getItem('token')
    if (token) {
        config.headers.token = window.sessionStorage.getItem('token')
    }
    return config
})
const app = createApp(App)
app.config.globalProperties.$http = axios
// app.config.globalProperties.$socket = socket
app.use(ElementPlus)
app.use(router).mount('#app')
