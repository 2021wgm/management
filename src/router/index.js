import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
// import UserInfo from '../components/userInfo.vue'
import UserInfo from '../components/userInfo'
import WelCome from '../components/welCome'
import Roles from '../components/rights/roles.vue'
import Rights from '../components/rights/rights.vue'
import Categories from '../components/goodsManagement/categories'
import Goods_params from '../components/goodsManagement/goods_params'

import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)
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
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Goods_params
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
