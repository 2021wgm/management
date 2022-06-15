import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
// import UserInfo from '../components/userInfo.vue'
import UserInfo from '../components/userInfo'
import WelCome from '../components/welCome'

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welCome',
        component: WelCome
      },
      {
        path: '/users',
        component: UserInfo
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    next();
  } else {
      let token = sessionStorage.getItem('token')
      if(!token) {
        next('/login');
      }else {
        next()
      }  
  }
})



export default router
