import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'templates',
        name: 'Templates',
        component: () => import('@/views/templates/index.vue'),
        meta: { title: '模板中心' }
      },
      {
        path: 'templates/:id',
        name: 'TemplateDetail',
        component: () => import('@/views/templates/detail.vue'),
        meta: { title: '模板详情' }
      },
      {
        path: 'user',
        name: 'UserCenter',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心', requiresAuth: true },
        children: [
          {
            path: '',
            name: 'MyResumes',
            component: () => import('@/views/user/resumes.vue'),
            meta: { title: '我的简历' }
          },
          {
            path: 'favorites',
            name: 'Favorites',
            component: () => import('@/views/user/favorites.vue'),
            meta: { title: '收藏模板' }
          },
          {
            path: 'history',
            name: 'History',
            component: () => import('@/views/user/history.vue'),
            meta: { title: '历史记录' }
          },
          {
            path: 'trash',
            name: 'Trash',
            component: () => import('@/views/user/trash.vue'),
            meta: { title: '回收站' }
          },
          {
            path: 'settings',
            name: 'Settings',
            component: () => import('@/views/user/settings.vue'),
            meta: { title: '账号设置' }
          }
        ]
      }
    ]
  },
  {
    path: '/editor/:id?',
    name: 'Editor',
    component: () => import('@/layouts/EditorLayout.vue'),
    meta: { title: '简历编辑', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'EditorMain',
        component: () => import('@/views/editor/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('@/views/preview/index.vue'),
    meta: { title: '简历预览' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '幸运简历'} - 幸运简历`
  
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
