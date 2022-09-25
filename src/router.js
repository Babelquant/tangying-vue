import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/login.vue'
import Home from './components/home.vue'
import Review from './components/review.vue'
import Board from './components/board.vue'
import Trader from './components/trader.vue'
import Test from './components/test.vue'

Vue.use(Router)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/home', 
    component: Home,
    children:[
      {path: '/review', component: Review},
      { path: '/board', component: Board },
      { path: '/trader', component: Trader }
    ] 
  },
  { path: '/test', component: Test }
]

export default new Router({
  routes
})
