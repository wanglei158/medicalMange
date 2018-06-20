import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login'
import Home from '@/view/home'

import Cash from '@/view/cashier'
import Transc from '@/view/transc'
import Acount from '@/view/jiesuan'
import Count from '@/view/countMange'

import Log from '@/view/log'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Login
    },
    {
      path:'/home',
      name:'home',
      redirect:'/count',
      component:Home,
      children:[
        {
          path:'/count',
          name:'count',
          component:Count
        },
        {
          path:'/acount',
          name:'acount',
          component:Acount
        },
        {
          path:'/transc',
          name:'transc',
          component:Transc
        },
        {
          path:'/cash',
          name:'cash',
          component:Cash
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/log',
      name:'log',
      component:Log
    }
  ]
})
