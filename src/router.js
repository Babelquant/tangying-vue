import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/login.vue'

Vue.use(Router)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' }
]

export default new Router({
  routes
})
