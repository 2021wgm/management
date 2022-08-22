import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$http = axios;
Vue.use(VueQuillEditor)
// axios.create({
//   baseURL: 'http://127.0.0.1:8888/api/private/v1/'
// })
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(function(config) {
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
})

import './elementComponent'
import './assets/font/iconfont.css'
import './assets/font-menu/iconfont.css'
import './assets/font2/iconfont.css'
import "./assets/global.css"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
