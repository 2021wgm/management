import Vue from 'vue'
// import VueRouter from 'vue-router'
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
    component: resolve => require(['../views/login'],resolve)
  },
  {
    path: '/home',
    component:resolve => require(['../views/home'],resolve),
    redirect: '/welcome',
    children: [
      {
        path: '/welCome',
        component: resolve => require(['../components/welCome'],resolve)
      },
      {
        path: '/users',
        component: resolve => require(['../components/userInfo'],resolve)
      },
      {
        path: '/roles',
        component: resolve => require(['../components/rights/roles'],resolve)
      },
      {
        path: '/rights',
        component: resolve => require(['../components/rights/rights'],resolve)
      },
      {
        path: '/categories',
        component: resolve => require(['../components/goodsManagement/categories'],resolve)
      },
      {
        path: '/params',
        component:  resolve => require(['../components/goodsManagement/goods_params'],resolve)
      },
      {
        path: '/goods',
        component:  resolve => require(['../components/goodsManagement/goods_list'],resolve),
      },
      {
        path: '/goods/addGoods',
        component:  resolve => require(['../components/goodsManagement/addFoods'],resolve),
      },
      {
        path: '/reports',
        component:  resolve => require(['../components/report'],resolve),
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

// const originalPush = router.prototype.push
// //修改原型对象中的push方法
// router.prototype.push = function push(location) {
//    return originalPush.call(this, location).catch(err => err)
// }

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
