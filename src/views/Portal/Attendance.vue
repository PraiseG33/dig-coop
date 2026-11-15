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
const meetings = computed(() => JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'))
const totalMeetings = computed(() => meetings.value.length)
const attended = computed(() => Number(member.value.meetingsAttended || 0))
const missed = computed(() => Math.max(0, totalMeetings.value - attended.value))
const attendancePct = computed(() =>
  totalMeetings.value ? Math.min(100, Math.round((attended.value / totalMeetings.value) * 100)) : 0
)

const statusLabel = computed(() => {
  if (attendancePct.value >= 75) return { label: 'Excellent', color: 'text-green-600' }
  if (attendancePct.value >= 50) return { label: 'Average', color: 'text-yellow-600' }
  return { label: 'Low', color: 'text-red-600' }
})
</script>

<template>
  <PortalSidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <div>
      <h1 class="text-[27px] font-medium">My Attendance</h1>
      <p class="text-gray-400 font-semibold">Your meeting attendance record.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Meetings</p>
        <p class="text-3xl font-bold text-gray-800">{{ totalMeetings }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Attended</p>
        <p class="text-3xl font-bold text-green-700">{{ attended }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Missed</p>
        <p class="text-3xl font-bold text-red-500">{{ missed }}</p>
      </div>
    </div>

    <!-- Attendance Visual -->
    <div class="bg-white p-8 rounded-xl shadow-md flex flex-col items-center gap-4">
      <h2 class="font-semibold text-gray-700 self-start">Attendance Rate</h2>
      <div class="relative w-36 h-36">
        <svg viewBox="0 0 36 36" class="w-36 h-36 -rotate-90">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e5e7eb" stroke-width="3"/>
          <circle cx="18" cy="18" r="15.9155" fill="none"
            :stroke="attendancePct >= 75 ? '#16a34a' : attendancePct >= 50 ? '#eab308' : '#ef4444'"
            stroke-width="3"
            :stroke-dasharray="`${attendancePct} 100`"
            stroke-linecap="round"/>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-gray-800">{{ attendancePct }}%</span>
        </div>
      </div>
      <p class="text-lg font-semibold" :class="statusLabel.color">{{ statusLabel.label }} Attendance</p>
      <p class="text-sm text-gray-500 text-center">
        You attended <strong>{{ attended }}</strong> out of <strong>{{ totalMeetings }}</strong> meetings recorded.
        <span v-if="totalMeetings === 0" class="block mt-1 text-gray-400">No meetings have been recorded yet.</span>
      </p>
    </div>

    <!-- Meetings List -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="font-semibold text-gray-700">All Recorded Meetings</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-500">
              <th class="text-left px-5 py-4">#</th>
              <th class="text-left px-5 py-4">Meeting Title</th>
              <th class="text-left px-5 py-4">Date</th>
              <th class="text-left px-5 py-4">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="meetings.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400">No meetings recorded yet.</td>
            </tr>
            <tr v-for="(m, i) in meetings" :key="m.id || i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 text-gray-400">{{ i + 1 }}</td>
              <td class="px-5 py-4 font-medium text-gray-800">{{ m.title || m.name || 'Meeting ' + (i+1) }}</td>
              <td class="px-5 py-4 text-gray-600">{{ m.date || '—' }}</td>
              <td class="px-5 py-4 text-gray-600">{{ m.type || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
