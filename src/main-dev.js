import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'vue-nprogress'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(NProgress)
const nprogress = new NProgress()

Vue.prototype.$http = axios;
Vue.use(VueQuillEditor)
// axios.create({
//   baseURL: 'http://127.0.0.1:8888/api/private/v1/'
// })
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

import './elementComponent'
import './assets/font/iconfont.css'
import './assets/font-menu/iconfont.css'
import './assets/font2/iconfont.css'
import "./assets/global.css"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  nprogress,
  render: h => h(App)
}).$mount('#app')

axios.interceptors.request.use(function(config) {
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
})

axios.interceptors.response.use(function(config) {
  return config;
})
