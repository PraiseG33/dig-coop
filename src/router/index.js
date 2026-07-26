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
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
  },

  // ── Admin routes ────────────────────────────────────────────────────────
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('@/views/Members.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/contributions',
    name: 'contributions',
    component: () => import('@/views/Transaction.vue/Contributions.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/loans',
    name: 'loans',
    component: () => import('@/views/Transaction.vue/Loans.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/savings',
    name: 'savings',
    component: () => import('@/views/Transaction.vue/Savings.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/views/Meetings/Attendance.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/dividends',
    name: 'dividends',
    component: () => import('@/views/Meetings/Dividends.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/financial',
    name: 'financial',
    component: () => import('@/views/Reports/Financial.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('@/views/Reports/Export.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },

  // ── Member portal routes ─────────────────────────────────────────────────
  {
    path: '/portal/dashboard',
    name: 'PortalDashboard',
    component: () => import('@/views/Portal/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'member' },
  },
  {
    path: '/portal/contributions',
    name: 'PortalContributions',
    component: () => import('@/views/Portal/Contributions.vue'),
    meta: { requiresAuth: true, role: 'member' },
  },
  {
    path: '/portal/loans',
    name: 'PortalLoans',
    component: () => import('@/views/Portal/Loans.vue'),
    meta: { requiresAuth: true, role: 'member' },
  },
  {
    path: '/portal/dividends',
    name: 'PortalDividends',
    component: () => import('@/views/Portal/Dividends.vue'),
    meta: { requiresAuth: true, role: 'member' },
  },
  {
    path: '/portal/attendance',
    name: 'PortalAttendance',
    component: () => import('@/views/Portal/Attendance.vue'),
    meta: { requiresAuth: true, role: 'member' },
  },
  {
    path: '/portal/savings',
    name: 'PortalSavings',
    component: () => import('@/views/Portal/Savings.vue'),
    meta: { requiresAuth: true, role: 'member' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList,
})

// Navigation guard — role-aware
router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true

  const raw = localStorage.getItem('dcms_session') || sessionStorage.getItem('dcms_session')
  if (!raw) return { name: 'Login' }

  let session
  try { session = JSON.parse(raw) } catch { return { name: 'Login' } }

  const requiredRole = to.meta.role

  // Admin trying to access member portal → redirect to admin dashboard
  if (requiredRole === 'member' && session.role !== 'member') {
    return { name: 'Dashboard' }
  }

  // Member trying to access admin routes → redirect to member portal
  if (requiredRole === 'admin' && session.role !== 'admin') {
    return { name: 'PortalDashboard' }
  }

  return true
})

export default router
