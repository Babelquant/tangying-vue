import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/login.vue'
import Home from './components/home.vue'
import Test from './components/test.vue'

Vue.use(Router)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/home', component: Home },
  { path: '/test', component: Test }
]

export default new Router({
  routes
})
