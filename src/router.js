import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/login.vue'
import Home from './components/home.vue'
import General from './components/general.vue'
import Trader from './components/trader.vue'
import Test from './components/test.vue'

Vue.use(Router)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/home', 
    component: Home,
    redirect: '/general', 
    children:[{path: '/general', 
    component: General}] 
  },
  { path: '/trader', component: Trader },
  { path: '/test', component: Test }
]

export default new Router({
  routes
})
