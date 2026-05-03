<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import coopLogo from '@/assets/images/cooplogo.png'
// import mobileLogo from '@/assets/images/logo.png'
import bgImage from '@/assets/images/young-international-people-working-together-use-laptop.jpg'

const router = useRouter()

// Hardcoded admin credentials for MVP (no backend)
const ADMIN_CREDENTIALS = [
  { cooperative: 'Grace Church Cooperative',  id: 'ADMIN001', password: 'admin123' },
  { cooperative: 'Unity Staff Cooperative',   id: 'ADMIN001', password: 'admin123' },
  { cooperative: 'ABC Traders Cooperative',   id: 'ADMIN001', password: 'admin123' },
]

const form = ref({
  cooperative: '',
  membershipID: '',
  password: '',
  rememberMe: false,
})

const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = () => {
  errorMsg.value = ''
  isLoading.value = true

  // Small delay so the button state is visible
  setTimeout(() => {
    const match = ADMIN_CREDENTIALS.find(
      (c) =>
        c.cooperative === form.value.cooperative &&
        c.id === form.value.membershipID.trim() &&
        c.password === form.value.password
    )

    if (match) {
      // Store session flag in localStorage
      const session = {
        role: 'admin',
        cooperative: form.value.cooperative,
        membershipID: form.value.membershipID,
      }
      if (form.value.rememberMe) {
        localStorage.setItem('dcms_session', JSON.stringify(session))
      } else {
        sessionStorage.setItem('dcms_session', JSON.stringify(session))
      }
      router.push('/dashboard')
    } else {
      errorMsg.value = 'Invalid Membership ID or password. Please try again.'
    }

    isLoading.value = false
  }, 400)
}
</script>

<template>
<div
  class="min-h-screen flex items-center justify-center py-10 px-4 lg:px-8 relative overflow-hidden"
  :style="{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }"
>
    <div class="absolute inset-0 bg-black/70"></div>

    <div class="relative z-10 flex lg:flex-row flex-col w-full max-w-6xl">

      <!-- Left Info Section -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start lg:pl-12">
        <div class="hidden lg:flex lg:flex-col items-center lg:items-start text-center lg:text-left max-w-md">
          <img :src="coopLogo" alt="Logo" class="-mb-15"/>
          <h1 class="text-[27px] font-semibold text-gray-300 mt-4">
            Empowering Communities Through Digital Cooperatives
          </h1>
          <p class="text-[16px] font-medium text-white mt-2">
            Our platform helps cooperatives operate efficiently by simplifying savings, loans,
            and member management. It brings transparency, easy record-keeping, and modern tools
            to support collective growth and stronger community participation.
          </p>
        </div>

        <div class="lg:hidden flex flex-col items-center text-center mb-5">
          <img :src="coopLogo" alt="Logo" width="150px" class="mb-3" />
          <h2 class="text-xl font-semibold text-gray-300">
            Empowering Communities Through Digital Cooperatives
          </h2>
        </div>
      </div>

      <!-- Right Form Section -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center lg:pr-12">
        <div class="bg-white rounded-[10px] shadow-lg p-6 lg:p-8 w-full max-w-md">

          <h1 class="text-center font-bold text-[30px]">Admin Login</h1>
          <p class="text-center text-sm text-gray-500 mt-1">
            This portal is for cooperative administrators only.
          </p>

          <!-- Error message -->
          <div
            v-if="errorMsg"
            class="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-md"
          >
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4 mt-6">

            <!-- Cooperative -->
            <div>
              <label class="font-semibold text-sm">Select Cooperative</label>
              <select
                v-model="form.cooperative"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
                required
              >
                <option value="" disabled selected hidden>Select cooperative</option>
                <option>Grace Church Cooperative</option>
                <option>Unity Staff Cooperative</option>
                <option>ABC Traders Cooperative</option>
              </select>
            </div>

            <!-- Admin ID -->
            <div>
              <label class="font-semibold text-sm">Admin ID</label>
              <input
                v-model="form.membershipID"
                type="text"
                placeholder="Enter your Admin ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
                required
              />
            </div>

            <!-- Password -->
            <div>
              <label class="font-semibold text-sm">Password</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
                required
              />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center gap-2">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                id="rememberMe"
                class="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <label for="rememberMe" class="text-gray-700 font-medium text-sm">
                Keep me logged in
              </label>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-linear-to-r from-green-400 to-blue-600 p-3 rounded-md
                     text-white font-semibold mt-4 hover:to-blue-900 transition
                     disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>

          </form>

          <!-- Hint for demo/testing -->
          <p class="text-center text-xs text-gray-400 mt-5">
            Default credentials — ID: <span class="font-mono font-medium">ADMIN001</span> &nbsp;|&nbsp; Password: <span class="font-mono font-medium">admin123</span>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>
