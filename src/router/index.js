import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    // 引入ScanView.vue
    path: '/scan',
    name: 'scan',
    component: () => import('../views/compare/ScanView.vue')
  },
  {
    // 引入GazeView.vue
    path: '/gaze',
    name: 'gaze',
    component: () => import('../views/compare/GazeView.vue')
  },
  {
    path: '/',
    redirect: '/scan' 
  }
]

const router = new VueRouter({
  routes
})

export default router
