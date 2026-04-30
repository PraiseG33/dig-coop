<script setup>
  import Sidebar from './Sidebar.vue'
  
  const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },

  { label: 'Members', href: '/members' },  // Essential: Member management

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

  { label: 'Settings', href: '#' }
]
const logout = () => {
  localStorage.removeItem('cooperativeMembers');
  localStorage.removeItem('cooperativeMeetings');
  localStorage.removeItem('currentUser'); // if you add login later
  window.location.href = '/'; // or use router
}
  </script>
  
  <template>
    <nav class="shadow-md sticky top-0 z-30 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 lg:h-20">
  
          <!-- Logo -->
          <div>
            <img src="/src/assets/images/logo (1).svg" alt="Logo" class="h-10 lg:h-14 w-auto">
          </div>
  
          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-10">
            <div
              v-for="link in navLinks"
              :key="link.label"
              class="relative group text-gray-700 font-medium pb-1"
            >
              <!-- Parent link with underline -->
              <a 
                :href="link.href || '#'"
                class="flex items-center gap-1 pb-1 relative 
                       after:absolute after:bottom-0 after:left-0 after:h-0.5 
                       after:w-0 after:bg-green-600 after:transition-all after:duration-300 
                       group-hover:after:w-full hover:text-green-600"
              >
                {{ link.label }}
                
                <!-- Arrow -->
                <svg
                  v-if="link.children"
                  class="w-4 h-4 mt-1 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
  
              <!-- Dropdown -->
              <div
                v-if="link.children"
                class="absolute left-0 mt-2 w-40 bg-white border rounded-xl border-gray-200 shadow-lg 
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                       transition-all duration-200"
              >
                <a 
                  v-for="child in link.children"
                  :key="child.label"
                  :href="child.href"
                  class="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                >
                  {{ child.label }}
                </a>
              </div>
            </div>
          </div>
  
          <!-- Desktop Logout -->
          <button @click="logout" class="hidden lg:block px-3 py-2 text-[13px] text-center text-red-600 
          border border-red-600 rounded-lg 
          hover:bg-red-50 font-semibold transition hover:scale-103">
            Logout
        </button>
  
          <!-- Mobile Sidebar -->
          <Sidebar :nav-links="navLinks" auth-state="authenticated" />
  
        </div>
      </div>
    </nav>
  </template>
  