import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
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

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    next();
  } else {
    if(to.path === '/home') {
      let token = sessionStorage.getItem('token')
      if(!token) {
        next('/login');
      }else {
        next()
      }
    }
  }
})

axios.interceptors.request.use(function(config) {
  config.headers.Authoration = sessionStorage.getItem('token');
  return config;
})

export default router
