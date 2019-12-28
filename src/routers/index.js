import Vue from 'vue'
import Router from 'vue-router'
import applyLeave from './home'
import login from './login'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  // base:"./",
  routes: [
    applyLeave,
    login,
    {
      path:"/*",
      redirect:"/login"
    }
  ]
})
