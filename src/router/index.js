import Vue from 'vue'
import Router from 'vue-router'
import Chatroom from '@/components/ChatRoom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lets chat',
      component: Chatroom
    }
  ]
})
