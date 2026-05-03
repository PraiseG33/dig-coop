<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  navLinks: {
    type: Array,
    required: true,
    default: () => []
  },
  authState: {
    type: String,
    default: 'guest',
    validator: (v) => ['guest', 'authenticated'].includes(v)
  },
  logoSrc: {
    type: String,
    default: ''
  }
})

const isOpen = ref(false)
const openDropdowns = ref({})
const activeLink = ref('')

const toggleMenu = () => { isOpen.value = !isOpen.value }
const closeMenu = () => { isOpen.value = false }

const toggleDropdown = (label) => {
  const currentState = openDropdowns.value[label]
  openDropdowns.value = {}
  openDropdowns.value[label] = !currentState
}

const isActive = (link) => {
  if (link.href && link.href !== '#') {
    return route.path === link.href
  }
  if (link.children) {
    return link.children.some(child => route.path === child.href)
  }
  return false
}

const isChildActive = (child) => {
  return route.path === child.href
}

defineExpose({ toggleMenu })
</script>

<template>
  <!-- Hamburger Button -->
  <button
    @click="toggleMenu"
    class="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
    aria-label="Open menu"
  >
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        v-if="!isOpen"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>

  <!-- Backdrop Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="closeMenu"
  ></div>

  <!-- Sidebar Drawer -->
  <div
    :class="[
      'fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="border border-gray-200 shadow-sm h-[65.4px] mb-9">
      <img :src="logoSrc" alt="Logo" class="w-35 mx-auto"/>
    </div>

    <div class="p-6 border border-gray-200 mx-4 rounded-[20px] shadow-md">

      <!-- Navigation Links -->
      <nav class="px-1 py-5 space-y-5">
        <div
          v-for="link in navLinks"
          :key="link.label"
          :class="[
            'border px-3 py-3 rounded-[20px] shadow-md transition hover:shadow-lg',
            isActive(link) || activeLink === link.href
              ? 'border-green-400 bg-green-50'
              : 'border-gray-200'
          ]"
        >
          <div class="flex justify-between items-center">
            <a
              :href="link.href || '#'"
              :class="[
                'block text-md mx-auto font-medium transition hover:scale-103',
                isActive(link) || activeLink === link.href
                  ? 'text-green-600 font-semibold'
                  : 'text-gray-800 hover:text-green-600'
              ]"
              @click="activeLink = link.href; !link.children ? closeMenu() : toggleDropdown(link.label)"
            >
              {{ link.label }}
            </a>

            <!-- Dropdown toggle button -->
            <button
              v-if="link.children"
              @click="toggleDropdown(link.label)"
              class="text-gray-500 p-1"
            >
              <svg
                :class="{'rotate-180': openDropdowns[link.label]}"
                class="w-4 h-4 transition-transform"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          <!-- Children links -->
          <div
            v-if="link.children && openDropdowns[link.label]"
            class="mt-1 space-y-3 border border-gray-200 rounded-xl shadow-lg py-4 px-1.5 leading-9"
          >
            <a
              v-for="child in link.children"
              :key="child.label"
              :href="child.href"
              :class="[
                'block font-medium text-md transition text-center',
                isChildActive(child)
                  ? 'text-green-600 bg-green-50 font-semibold px-2 rounded-lg'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              ]"
              @click="closeMenu()"
            >
              {{ child.label }}
            </a>
          </div>
        </div>
      </nav>

      <!-- Auth Section -->
      <div class="mt-8 space-y-4">
        <template v-if="authState === 'guest'">
          <a
            href="/login"
            class="block px-6 py-3 text-center text-green-600 border border-green-600 rounded-lg
            hover:bg-green-100 font-semibold transition hover:scale-103"
            @click="closeMenu"
          >
            Login
          </a>
          <a
            href="/signup"
            class="block px-6 py-3 text-center bg-linear-to-r from-green-600 to-green-800
            text-white rounded-lg hover:to-green-900 font-semibold transition hover:scale-103"
            @click="closeMenu"
          >
            Sign Up
          </a>
        </template>

        <template v-else-if="authState === 'authenticated'">
          <a
            href="/"
            class="block px-6 py-3 text-center text-red-600 border border-red-600 rounded-lg
            hover:bg-red-50 font-semibold transition hover:scale-103"
            @click="closeMenu"
          >
            Logout
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
