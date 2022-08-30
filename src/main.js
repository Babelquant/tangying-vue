import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'jquery'
import './assets/css/global.css'
import * as echarts from 'echarts'
import './plugins/charts.js'
import axios from 'axios'
import VueMarquee from 'vue-marquee-component'

Vue.use(VueMarquee).use(ElementUI)
Vue.prototype.axios = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

// axios.defaults.baseURL = '/src/assets'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
