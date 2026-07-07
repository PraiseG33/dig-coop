<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMembers } from '@/composables/useMembers'
import coopLogo from '@/assets/images/cooplogo.webp'
import bgImage from '@/assets/images/young-international-people-working-together-use-laptop.jpg'

const router = useRouter()
const { members } = useMembers()

const loginType = ref('admin') // 'admin' | 'member'

const ADMIN_CREDENTIALS = [
  { cooperative: 'Grace Church Cooperative',  id: 'ADMIN001', password: 'admin123' },
  { cooperative: 'Unity Staff Cooperative',   id: 'ADMIN001', password: 'admin123' },
  { cooperative: 'ABC Traders Cooperative',   id: 'ADMIN001', password: 'admin123' },
]

const adminForm = ref({ cooperative: '', membershipID: '', password: '', rememberMe: false })
const memberForm = ref({ membershipId: '', password: '', rememberMe: false })
const errorMsg = ref('')
const isLoading = ref(false)

const switchType = (type) => {
  loginType.value = type
  errorMsg.value = ''
}

const handleAdminLogin = () => {
  errorMsg.value = ''
  isLoading.value = true
  setTimeout(() => {
    const match = ADMIN_CREDENTIALS.find(
      c => c.cooperative === adminForm.value.cooperative &&
           c.id === adminForm.value.membershipID.trim() &&
           c.password === adminForm.value.password
    )
    if (match) {
      const session = { role: 'admin', cooperative: adminForm.value.cooperative, membershipID: adminForm.value.membershipID }
      if (adminForm.value.rememberMe) {
        localStorage.setItem('dcms_session', JSON.stringify(session))
      } else {
        sessionStorage.setItem('dcms_session', JSON.stringify(session))
      }
      router.push('/dashboard')
    } else {
      errorMsg.value = 'Invalid credentials. Please try again.'
    }
    isLoading.value = false
  }, 400)
}

const handleMemberLogin = () => {
  errorMsg.value = ''
  isLoading.value = true
  setTimeout(() => {
    const id = memberForm.value.membershipId.trim().toUpperCase()
    const member = members.value.find(m =>
      (m.membershipId || '').toUpperCase() === id &&
      m.portalActivated &&
      m.portalPassword === memberForm.value.password
    )
    if (member) {
      const session = { role: 'member', memberId: member.id, membershipId: member.membershipId, memberName: member.name }
      if (memberForm.value.rememberMe) {
        localStorage.setItem('dcms_session', JSON.stringify(session))
      } else {
        sessionStorage.setItem('dcms_session', JSON.stringify(session))
      }
      router.push('/portal/dashboard')
    } else {
      // Check if member exists but not activated
      const exists = members.value.find(m => (m.membershipId || '').toUpperCase() === id)
      if (exists && !exists.portalActivated) {
        errorMsg.value = 'Your account has not been activated yet. Please sign up first.'
      } else {
        errorMsg.value = 'Invalid Membership ID or password. Please try again.'
      }
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

      <!-- Left Info -->
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
          <img :src="coopLogo" alt="Logo" width="210px" class="-mb-10" />
          <h2 class="text-xl font-semibold text-gray-300">Empowering Communities Through Digital Cooperatives</h2>
        </div>
      </div>

      <!-- Right Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center lg:pr-12">
        <div class="bg-white rounded-[10px] shadow-lg p-6 lg:p-8 w-full max-w-md">

          <!-- Toggle -->
          <div class="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              @click="switchType('admin')"
              :class="[
                'flex-1 py-2 rounded-md text-sm font-semibold transition',
                loginType === 'admin' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Admin
            </button>
            <button
              @click="switchType('member')"
              :class="[
                'flex-1 py-2 rounded-md text-sm font-semibold transition',
                loginType === 'member' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Member
            </button>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-md">
            {{ errorMsg }}
          </div>

          <!-- Admin Login Form -->
          <div v-if="loginType === 'admin'">
            <h1 class="text-center font-bold text-[28px]">Admin Login</h1>
            <p class="text-center text-sm text-gray-500 mt-1 mb-5">For cooperative administrators only.</p>

            <div class="space-y-4">
              <div>
                <label class="font-semibold text-sm">Select Cooperative</label>
                <select v-model="adminForm.cooperative"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1" required>
                  <option value="" disabled selected hidden>Select cooperative</option>
                  <option>Grace Church Cooperative</option>
                  <option>Unity Staff Cooperative</option>
                  <option>ABC Traders Cooperative</option>
                </select>
              </div>
              <div>
                <label class="font-semibold text-sm">Admin ID</label>
                <input v-model="adminForm.membershipID" type="text" placeholder="Enter your Admin ID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1" />
              </div>
              <div>
                <label class="font-semibold text-sm">Password</label>
                <input v-model="adminForm.password" type="password" placeholder="Enter your password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1" />
              </div>
              <div class="flex items-center gap-2">
                <input v-model="adminForm.rememberMe" type="checkbox" id="adminRemember" class="h-4 w-4 text-green-600 border-gray-300 rounded" />
                <label for="adminRemember" class="text-gray-700 font-medium text-sm">Keep me logged in</label>
              </div>
              <button @click="handleAdminLogin" :disabled="isLoading"
                class="w-full bg-linear-to-r from-green-400 to-blue-600 p-3 rounded-md text-white font-semibold hover:to-blue-900 transition disabled:opacity-60">
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </div>
            <p class="text-center text-xs text-gray-400 mt-5">
              Default — ID: <span class="font-mono font-medium">ADMIN001</span> &nbsp;|&nbsp; Password: <span class="font-mono font-medium">admin123</span>
            </p>
          </div>

          <!-- Member Login Form -->
          <div v-else>
            <h1 class="text-center font-bold text-[28px]">Member Login</h1>
            <p class="text-center text-sm text-gray-500 mt-1 mb-5">Access your cooperative portal.</p>

            <div class="space-y-4">
              <div>
                <label class="font-semibold text-sm">Membership ID</label>
                <input v-model="memberForm.membershipId" type="text" placeholder="e.g. COOP-0001"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1" />
              </div>
              <div>
                <label class="font-semibold text-sm">Password</label>
                <input v-model="memberForm.password" type="password" placeholder="Enter your password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1" />
              </div>
              <div class="flex items-center gap-2">
                <input v-model="memberForm.rememberMe" type="checkbox" id="memberRemember" class="h-4 w-4 text-green-600 border-gray-300 rounded" />
                <label for="memberRemember" class="text-gray-700 font-medium text-sm">Keep me logged in</label>
              </div>
              <button @click="handleMemberLogin" :disabled="isLoading"
                class="w-full bg-linear-to-r from-green-400 to-blue-600 p-3 rounded-md text-white font-semibold hover:to-blue-900 transition disabled:opacity-60">
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </div>
            <p class="text-center text-sm text-gray-500 mt-5">
              Not activated yet?
              <a href="/signup" class="text-blue-500 font-semibold hover:underline">Sign up here</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
