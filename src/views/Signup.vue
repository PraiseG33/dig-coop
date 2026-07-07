<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMembers } from '@/composables/useMembers'
import coopLogo from '@/assets/images/cooplogo.webp'
import bgImage from '@/assets/images/young-international-people-working-together-use-laptop.jpg'

const router = useRouter()
const { members } = useMembers()

// Steps: 'verify' -> 'setpassword' -> 'done'
const step = ref('verify')

const verifyForm = ref({ membershipId: '', contact: '' })
const passwordForm = ref({ password: '', confirm: '' })
const errorMsg = ref('')
const isLoading = ref(false)
const matchedMember = ref(null)

const showPassword = ref(false)
const showConfirm = ref(false)

const passwordStrength = computed(() => {
  const p = passwordForm.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value])
const strengthColor = computed(() => ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][passwordStrength.value])

const handleVerify = () => {
  errorMsg.value = ''
  const id = verifyForm.value.membershipId.trim().toUpperCase()
  const contact = verifyForm.value.contact.trim().toLowerCase()

  if (!id || !contact) {
    errorMsg.value = 'Please fill in both fields.'
    return
  }

  isLoading.value = true
  setTimeout(() => {
    const found = members.value.find(m =>
      (m.membershipId || '').toUpperCase() === id &&
      ((m.email || '').toLowerCase() === contact || (m.phone || '') === verifyForm.value.contact.trim())
    )

    if (!found) {
      errorMsg.value = 'No member found with that ID and contact. Please check your details or contact your admin.'
      isLoading.value = false
      return
    }

    if (found.portalActivated) {
      errorMsg.value = 'This account is already activated. Please use the Member Login instead.'
      isLoading.value = false
      return
    }

    matchedMember.value = found
    step.value = 'setpassword'
    isLoading.value = false
  }, 400)
}

const handleSetPassword = () => {
  errorMsg.value = ''
  const { password, confirm } = passwordForm.value

  if (password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }
  if (password !== confirm) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  setTimeout(() => {
    // Save password and mark as activated
    matchedMember.value.portalPassword = password
    matchedMember.value.portalActivated = true

    step.value = 'done'
    isLoading.value = false
  }, 400)
}

const goToLogin = () => router.push('/login')
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
            Activate Your Member Portal
          </h1>
          <p class="text-[16px] font-medium text-white mt-2">
            Your admin has already registered you. Use your Membership ID and registered
            phone or email to verify your identity, then set your own password to access
            your cooperative activities anytime.
          </p>
        </div>
        <div class="lg:hidden flex flex-col items-center text-center mb-5">
          <img :src="coopLogo" alt="Logo" width="210px" class="-mb-10" />
          <h2 class="text-xl font-semibold text-gray-300">Activate Your Member Portal</h2>
        </div>
      </div>

      <!-- Right Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center lg:pr-12">
        <div class="bg-white rounded-[10px] shadow-lg p-6 lg:p-8 w-full max-w-md">

          <!-- Step: Verify -->
          <div v-if="step === 'verify'">
            <h1 class="text-center font-bold text-[28px]">Member Sign Up</h1>
            <p class="text-center text-sm text-gray-500 mt-1">Verify your identity to activate your portal account.</p>

            <div v-if="errorMsg" class="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-md">
              {{ errorMsg }}
            </div>

            <div class="space-y-4 mt-6">
              <div>
                <label class="font-semibold text-sm">Membership ID</label>
                <input
                  v-model="verifyForm.membershipId"
                  type="text"
                  placeholder="e.g. COOP-0001"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
                />
              </div>
              <div>
                <label class="font-semibold text-sm">Registered Phone or Email</label>
                <input
                  v-model="verifyForm.contact"
                  type="text"
                  placeholder="Phone number or email address"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
                />
              </div>
              <button
                @click="handleVerify"
                :disabled="isLoading"
                class="w-full bg-linear-to-r from-green-400 to-blue-600 p-3 rounded-md text-white font-semibold mt-2 hover:to-blue-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Verifying...' : 'Verify Identity' }}
              </button>
            </div>

            <p class="text-center text-sm text-gray-500 mt-5">
              Already activated?
              <a href="/login" class="text-blue-500 font-semibold hover:underline">Login here</a>
            </p>
          </div>

          <!-- Step: Set Password -->
          <div v-else-if="step === 'setpassword'">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800">Identity Verified!</p>
                <p class="text-sm text-gray-500">Welcome, {{ matchedMember?.name }}</p>
              </div>
            </div>

            <h2 class="font-bold text-xl mb-1">Set Your Password</h2>
            <p class="text-sm text-gray-500 mb-4">This will be your password to log in to the member portal.</p>

            <div v-if="errorMsg" class="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-md">
              {{ errorMsg }}
            </div>

            <div class="space-y-4">
              <div>
                <label class="font-semibold text-sm">New Password</label>
                <div class="relative mt-1">
                  <input
                    v-model="passwordForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Minimum 6 characters"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 pr-10"
                  />
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
                <!-- Strength bar -->
                <div v-if="passwordForm.password" class="mt-2">
                  <div class="flex gap-1">
                    <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all"
                      :class="i <= passwordStrength ? strengthColor : 'bg-gray-200'"></div>
                  </div>
                  <p class="text-xs mt-1" :class="['text-red-400','text-yellow-500','text-blue-500','text-green-600'][passwordStrength-1]">
                    {{ strengthLabel }}
                  </p>
                </div>
              </div>

              <div>
                <label class="font-semibold text-sm">Confirm Password</label>
                <div class="relative mt-1">
                  <input
                    v-model="passwordForm.confirm"
                    :type="showConfirm ? 'text' : 'password'"
                    placeholder="Re-enter your password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 pr-10"
                  />
                  <button type="button" @click="showConfirm = !showConfirm"
                    class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <svg v-if="!showConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button
                @click="handleSetPassword"
                :disabled="isLoading"
                class="w-full bg-linear-to-r from-green-400 to-blue-600 p-3 rounded-md text-white font-semibold hover:to-blue-900 transition disabled:opacity-60"
              >
                {{ isLoading ? 'Activating...' : 'Activate Account' }}
              </button>
            </div>
          </div>

          <!-- Step: Done -->
          <div v-else-if="step === 'done'" class="text-center py-4">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Account Activated!</h2>
            <p class="text-gray-500 mb-6">
              Your portal account is ready, <strong>{{ matchedMember?.name }}</strong>. You can now log in with your Membership ID and password.
            </p>
            <button
              @click="goToLogin"
              class="w-full bg-linear-to-r from-green-400 to-blue-600 p-3 rounded-md text-white font-semibold hover:to-blue-900 transition"
            >
              Go to Login
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
