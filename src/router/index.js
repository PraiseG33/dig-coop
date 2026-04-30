import { createRouter, createWebHistory } from 'vue-router'

const routeList = [
  {
    path: '/',
    name: 'Guest',
    component: () => import('@/views/Guest.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  // /signup route removed — member registration is admin-only (Members page)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('@/views/Members.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/contributions',
    name: 'contributions',
    component: () => import('@/views/Transaction.vue/Contributions.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/loans',
    name: 'loans',
    component: () => import('@/views/Transaction.vue/Loans.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/views/Meetings/Attendance.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dividends',
    name: 'dividends',
    component: () => import('@/views/Meetings/Dividends.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/financial',
    name: 'financial',
    component: () => import('@/views/Reports/Financial.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('@/views/Reports/Export.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList,
})

// Navigation guard — redirects unauthenticated users to /login
router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true

  const session =
    localStorage.getItem('dcms_session') ||
    sessionStorage.getItem('dcms_session')

  if (!session) {
    return { name: 'Login' }
  }

  return true
})

export default router
