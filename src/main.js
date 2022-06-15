import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.prototype.$http = axios;
// axios.create({
//   baseURL: 'http://127.0.0.1:8888/api/private/v1/'
// })
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(function(config) {
  config.headers.Authorization = sessionStorage.getItem('token');
  // console.log(100, config)
  return config;
})

import './elementComponent'
import './assets/font/iconfont.css'
import './assets/font-menu/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
