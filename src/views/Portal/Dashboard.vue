<script setup>
import PortalSidenav from '@/components/PortalSidenav.vue'
import { computed } from 'vue'
import { useMembers } from '@/composables/useMembers'

const { members } = useMembers()

const session = computed(() => {
  const raw = localStorage.getItem('dcms_session') || sessionStorage.getItem('dcms_session')
  try { return raw ? JSON.parse(raw) : {} } catch { return {} }
})

const member = computed(() => members.value.find(m => m.id === session.value.memberId) || {})

const contributions = computed(() => {
  const all = JSON.parse(localStorage.getItem('cooperativeContributions') || '[]')
  return all.filter(c => c.memberId === session.value.memberId)
})

const loans = computed(() => {
  const all = JSON.parse(localStorage.getItem('cooperativeLoans') || '[]')
  return all.filter(l => l.memberId === session.value.memberId)
})

const dividends = computed(() => {
  const all = JSON.parse(localStorage.getItem('cooperativeDividendComputations') || '[]')
  return all.flatMap(comp => comp.records || []).filter(r => r.memberId === session.value.memberId)
})

const meetings = computed(() => JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'))

const totalMeetings = computed(() => meetings.value.length || 1)
const attendancePct = computed(() =>
  Math.min(100, Math.round((Number(member.value.meetingsAttended || 0) / totalMeetings.value) * 100))
)

const activeLoans = computed(() => loans.value.filter(l => l.status !== 'Fully Paid'))
const totalDividendsEarned = computed(() => dividends.value.reduce((s, d) => s + (d.weightedDividendAmount || 0), 0))

const fmt = n => Number(n || 0).toLocaleString()

const recentContributions = computed(() =>
  [...contributions.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
)

const rankedMembers = computed(() =>
  [...members.value].sort((a, b) => (Number(b.totalContributions) || 0) - (Number(a.totalContributions) || 0))
)

const leaderboard = computed(() => rankedMembers.value.slice(0, 5))

const myRank = computed(() => {
  const idx = rankedMembers.value.findIndex(m => m.id === session.value.memberId)
  return idx === -1 ? null : idx + 1
})
</script>

<template>
  <PortalSidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <!-- Welcome -->
    <div data-aos="fade-in">
      <h1 class="text-[27px] font-medium">Welcome back, {{ member.name || session.memberName }} 👋</h1>
      <p class="text-gray-400 font-semibold">Here's a summary of your cooperative activities.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md flex flex-col gap-1">
        <p class="text-sm text-gray-500">Total Contributions</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(member.totalContributions) }}</p>
        <p class="text-xs text-gray-400">{{ contributions.length }} record(s)</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md flex flex-col gap-1">
        <p class="text-sm text-gray-500">Total Savings</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(member.savingsAmount) }}</p>
        <p class="text-xs text-gray-400">Cooperative savings balance</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md flex flex-col gap-1">
        <p class="text-sm text-gray-500">Active Loans</p>
        <p class="text-2xl font-bold text-gray-800">{{ activeLoans.length }}</p>
        <p class="text-xs text-gray-400">{{ loans.length }} total loan(s)</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md flex flex-col gap-1">
        <p class="text-sm text-gray-500">Dividends Earned</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(totalDividendsEarned) }}</p>
        <p class="text-xs text-gray-400">{{ dividends.length }} computation(s)</p>
      </div>
    </div>

    <!-- Attendance + Profile -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Attendance Card -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="font-semibold text-gray-700 mb-4">Meeting Attendance</h2>
        <div class="flex items-center gap-4">
          <div class="relative w-24 h-24">
            <svg viewBox="0 0 36 36" class="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e5e7eb" stroke-width="3"/>
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#16a34a" stroke-width="3"
                :stroke-dasharray="`${attendancePct} 100`" stroke-linecap="round"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-lg font-bold text-gray-800">{{ attendancePct }}%</span>
            </div>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Attended <strong>{{ member.meetingsAttended || 0 }}</strong> of <strong>{{ totalMeetings }}</strong> meetings</p>
            <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
              :class="attendancePct >= 75 ? 'bg-green-600' : attendancePct >= 50 ? 'bg-yellow-500' : 'bg-red-500'">
              {{ attendancePct >= 75 ? 'Excellent' : attendancePct >= 50 ? 'Average' : 'Low Attendance' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="font-semibold text-gray-700 mb-4">My Profile</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Membership ID</span><span class="font-mono font-semibold text-gray-800">{{ member.membershipId }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Full Name</span><span class="font-medium text-gray-800">{{ member.name }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Phone</span><span class="text-gray-700">{{ member.phone || '—' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Email</span><span class="text-gray-700">{{ member.email || '—' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Badge</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-green-600">{{ member.badge || 'Member' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Engagement Leaderboard -->
    <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.317 9.38c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.963z"/>
          </svg>
          Engagement Leaderboard
        </h2>
        <span v-if="myRank" class="text-sm font-medium text-gray-500">
          Your rank: <span class="text-green-700 font-semibold">#{{ myRank }}</span> of {{ rankedMembers.length }}
        </span>
      </div>
      <ol v-if="leaderboard.length" class="space-y-3">
        <li
          v-for="(m, index) in leaderboard"
          :key="m.id"
          class="flex items-center justify-between p-3 rounded-lg transition"
          :class="m.id === session.memberId ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50 hover:bg-gray-100'"
        >
          <div class="flex items-center gap-3">
            <span
              class="text-lg font-bold w-7 h-7 flex items-center justify-center rounded-full"
              :class="index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-gray-300 text-white' : index === 2 ? 'bg-amber-600 text-white' : 'text-gray-500'"
            >{{ index + 1 }}</span>
            <div>
              <p class="font-medium">{{ m.name }}{{ m.id === session.memberId ? ' (You)' : '' }}</p>
              <p class="text-sm text-gray-500">Badge: {{ m.badge || 'New Member' }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500">{{ m.meetingsAttended || 0 }} meetings</p>
        </li>
      </ol>
      <p v-else class="text-gray-400 text-sm text-center py-8">Leaderboard will appear once members start contributing.</p>
    </div>

    <!-- Recent Contributions -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="font-semibold text-gray-700">Recent Contributions</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr class="text-gray-500 text-xs">
              <th class="text-left px-5 py-3">Date</th>
              <th class="text-left px-5 py-3">Type</th>
              <th class="text-left px-5 py-3">Method</th>
              <th class="text-right px-5 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="recentContributions.length === 0">
              <td colspan="4" class="text-center py-8 text-gray-400 text-sm">No contribution records yet.</td>
            </tr>
            <tr v-for="c in recentContributions" :key="c.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-3 text-gray-600">{{ c.date }}</td>
              <td class="px-5 py-3 text-gray-700">{{ c.type }}</td>
              <td class="px-5 py-3 text-gray-600">{{ c.paymentMethod }}</td>
              <td class="px-5 py-3 text-right font-medium text-green-700">₦{{ fmt(c.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
