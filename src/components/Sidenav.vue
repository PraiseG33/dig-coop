<script setup>
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import logoSrc from '@/assets/images/logo.png'

const route = useRoute()
const router = useRouter()

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Members', href: '/members' },
  { 
    label: 'Transactions',
    children: [
      { label: 'Contributions', href: '/contributions' },
      { label: 'Loans', href: '/loans' }
    ]
  },
  { 
    label: 'Meetings',
    children: [
      { label: 'Attendance', href: '/attendance' },
      { label: 'Dividends', href: '/dividends' }
    ]
  },
  { 
    label: 'Reports',
    children: [
      { label: 'Financial Summary', href: '/financial' },
      { label: 'Export Data', href: '/export' }
    ]
  },
  { label: 'Savings', href: '/savings' }
]

// Check if a link or any of its children is active
const isActive = (link) => {
  if (link.href && link.href !== '#') {
    return route.path === link.href
  }
  if (link.children) {
    return link.children.some(child => route.path === child.href)
  }
  return false
}

const logout = () => {
  localStorage.removeItem('dcms_session')
  sessionStorage.removeItem('dcms_session')
  router.replace('/')
}
</script>

<template>
  <nav class="shadow-md sticky top-0 z-30 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 lg:h-20">

        <!-- Logo -->
        <div>
          <img :src="logoSrc" alt="Logo" class="h-27 lg:h-30 w-auto">
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-10">
          <div
            v-for="link in navLinks"
            :key="link.label"
            class="relative group"
          >
            <!-- Parent link (real link if it has its own destination, otherwise just a hover-trigger for the dropdown) -->
            <a
              v-if="!link.children"
              :href="link.href"
              :class="[
                'flex items-center gap-1 pb-1 relative font-medium transition-colors duration-200',
                'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300',
                isActive(link)
                  ? 'text-green-600 after:w-full after:bg-green-600'
                  : 'text-gray-700 after:w-0 after:bg-green-600 group-hover:after:w-full hover:text-green-600'
              ]"
            >
              {{ link.label }}
            </a>
            <span
              v-else
              tabindex="0"
              :class="[
                'flex items-center gap-1 pb-1 relative font-medium transition-colors duration-200 cursor-default select-none',
                'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300',
                isActive(link)
                  ? 'text-green-600 after:w-full after:bg-green-600'
                  : 'text-gray-700 after:w-0 after:bg-green-600 group-hover:after:w-full hover:text-green-600'
              ]"
            >
              {{ link.label }}

              <!-- Arrow -->
              <svg
                class="w-4 h-4 mt-1 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>

            <!-- Dropdown -->
            <div
              v-if="link.children"
              class="absolute left-0 mt-2 w-44 bg-white border rounded-xl border-gray-200 shadow-lg
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible
                     transition-all duration-200"
            >
              <a
                v-for="child in link.children"
                :key="child.label"
                :href="child.href"
                :class="[
                  'block px-4 py-3 text-sm font-medium transition-colors',
                  route.path === child.href
                    ? 'text-green-600 bg-green-50 font-semibold'
                    : 'text-gray-700 hover:text-green-600'
                ]"
              >
                {{ child.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Desktop Logout -->
        <button
          @click="logout"
          class="hidden lg:block px-3 py-2 text-[13px] text-center text-red-600
                 border border-red-600 rounded-lg hover:bg-red-50 font-semibold
                 transition hover:scale-103"
        >
          Logout
        </button>

        <!-- Mobile Sidebar -->
        <Sidebar :nav-links="navLinks" auth-state="authenticated" :logo-src="logoSrc" />

      </div>
    </div>
  </nav>
</template>
