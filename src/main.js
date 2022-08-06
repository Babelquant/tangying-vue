import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'jquery'
import './assets/css/global.css'
import * as echarts from 'echarts'
import './plugins/charts.js'
import axios from 'axios'

// Vue.prototype.axios = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

// axios.defaults.baseURL = '/src/assets'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
