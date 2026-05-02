<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-6">
    <!-- Dashboard Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-in" data-aos-delay="20">
      <div>
        <h1 class="text-[27px] font-medium">Cooperative Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome back! Here's an overview of your cooperative activities.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="showQR = true" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow font-medium">
          Generate Meeting QR
        </button>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Members</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ totalMembers }}</p>
          </div>
          <div class="bg-blue-100 p-4 rounded-full">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Contributions</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ formatNumber(totalContributions) }}</p>
          </div>
          <div class="bg-green-100 p-4 rounded-full">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active Loans</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ activeLoans }}</p>
            <p class="text-xs text-gray-400 mt-0.5">₦{{ formatNumber(outstandingBalance) }} outstanding</p>
          </div>
          <div class="bg-orange-100 p-4 rounded-full">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Avg. Attendance Rate</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ avgAttendance }}%</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ totalMeetings }} meetings recorded</p>
          </div>
          <div class="bg-purple-100 p-4 rounded-full">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Gamified Engagement Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Leaderboard -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.317 9.38c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.963z"/>
          </svg>
          Engagement Leaderboard
        </h2>
        <ol v-if="leaderboard.length" class="space-y-3">
          <li
            v-for="(member, index) in leaderboard"
            :key="member.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <div class="flex items-center gap-3">
              <span
                class="text-lg font-bold w-7 h-7 flex items-center justify-center rounded-full"
                :class="index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-gray-300 text-white' : index === 2 ? 'bg-amber-600 text-white' : 'text-gray-500'"
              >{{ index + 1 }}</span>
              <div>
                <p class="font-medium">{{ member.name }}</p>
                <p class="text-sm text-gray-500">Badge: {{ member.badge || 'New Member' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium">₦{{ formatNumber(member.totalContributions) }}</p>
              <p class="text-sm text-gray-500">{{ member.meetingsAttended }} meetings</p>
            </div>
          </li>
        </ol>
        <p v-else class="text-gray-400 text-sm text-center py-8">Add members to see the leaderboard.</p>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <a href="/contributions" class="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-left block">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <p class="font-medium">Record Contribution</p>
          </a>
          <a href="/loans" class="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-left block">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="font-medium">Manage Loans</p>
          </a>
          <a href="/attendance" class="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-left block">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="font-medium">Mark Attendance</p>
          </a>
          <a href="/financial" class="p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition text-left block">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6"/>
            </svg>
            <p class="font-medium">View Reports</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Upcoming Meetings Banner -->
    <div v-if="upcomingMeetings.length" class="bg-white p-6 rounded-xl shadow-md">
      <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Upcoming / Recent Meetings
      </h2>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="mtg in upcomingMeetings"
          :key="mtg.id"
          class="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        >
          <p class="font-medium text-gray-800">{{ mtg.title }}</p>
          <p class="text-gray-500">{{ formatDate(mtg.date) }}</p>
        </div>
      </div>
    </div>

    <!-- QR Modal -->
    <div v-if="showQR" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-xl text-center">
        <h3 class="text-xl font-bold mb-4">Meeting Check-in QR Code</h3>
        <p class="text-sm text-gray-500 mb-4">Session ID: <span class="font-mono font-semibold">{{ currentQR }}</span></p>
        <div class="bg-gray-100 border-2 border-dashed rounded-xl w-64 h-64 mx-auto mb-6 flex items-center justify-center text-gray-400 text-sm">
          [QR Code — Session: {{ currentQR }}]
        </div>
        <button @click="showQR = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidenav from '@/components/Sidenav.vue';
import { useMembers } from '@/composables/useMembers';

const { members } = useMembers();

// Load meetings and loans from localStorage (kept in sync by their own pages)
const meetings = ref(JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'));
const loans = ref(JSON.parse(localStorage.getItem('cooperativeLoans') || '[]'));

const totalMembers = computed(() => members.value.length);

const totalContributions = computed(() =>
  members.value.reduce((sum, m) => sum + Number(m.totalContributions || 0), 0)
);

const activeLoans = computed(() => loans.value.filter(l => l.status === 'Active').length);
const outstandingBalance = computed(() => loans.value.reduce((sum, l) => sum + Number(l.balance || 0), 0));

const totalMeetings = computed(() => meetings.value.length);

const avgAttendance = computed(() => {
  if (!meetings.value.length || !members.value.length) return 0;
  const rates = meetings.value.map(m => {
    const present = (m.records || []).filter(r => r.status === 'Present').length;
    return members.value.length ? Math.round((present / members.value.length) * 100) : 0;
  });
  return Math.round(rates.reduce((s, r) => s + r, 0) / rates.length);
});

const leaderboard = computed(() =>
  [...members.value]
    .sort((a, b) => (Number(b.totalContributions) || 0) - (Number(a.totalContributions) || 0))
    .slice(0, 5)
);

const upcomingMeetings = computed(() =>
  [...meetings.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
);

const formatNumber = (num) => Number(num || 0).toLocaleString();
const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const showQR = ref(false);
const currentQR = 'MTG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
</script>
