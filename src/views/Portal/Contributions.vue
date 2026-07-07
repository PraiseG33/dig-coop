<script setup>
import PortalSidenav from '@/components/PortalSidenav.vue'
import { computed, ref } from 'vue'

const session = computed(() => {
  const raw = localStorage.getItem('dcms_session') || sessionStorage.getItem('dcms_session')
  try { return raw ? JSON.parse(raw) : {} } catch { return {} }
})

const all = JSON.parse(localStorage.getItem('cooperativeContributions') || '[]')
const contributions = computed(() => all.filter(c => c.memberId === session.value.memberId))

const searchQuery = ref('')
const filtered = computed(() => {
  if (!searchQuery.value.trim()) return contributions.value
  const q = searchQuery.value.toLowerCase()
  return contributions.value.filter(c =>
    (c.type || '').toLowerCase().includes(q) ||
    (c.paymentMethod || '').toLowerCase().includes(q) ||
    (c.date || '').includes(q)
  )
})

const total = computed(() => contributions.value.reduce((s, c) => s + Number(c.amount || 0), 0))
const fmt = n => Number(n || 0).toLocaleString()

const thisMonth = computed(() => {
  const now = new Date()
  return contributions.value
    .filter(c => { const d = new Date(c.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    .reduce((s, c) => s + Number(c.amount || 0), 0)
})
</script>

<template>
  <PortalSidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <div>
      <h1 class="text-[27px] font-medium">My Contributions</h1>
      <p class="text-gray-400 font-semibold">Your full contribution history.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Contributed</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(total) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">This Month</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(thisMonth) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Records</p>
        <p class="text-2xl font-bold text-gray-800">{{ contributions.length }}</p>
      </div>
    </div>

    <!-- Search -->
    <div class="flex justify-center bg-white shadow-md p-5 rounded-[40px]">
      <input v-model="searchQuery" type="search" placeholder="Search by type, method or date"
        class="w-full sm:w-[70%] border border-green-200 rounded-[20px] px-4 py-2 focus:outline-none focus:border-green-300" />
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-500 text-sm">
              <th class="text-left px-5 py-4">Date</th>
              <th class="text-left px-5 py-4">Type</th>
              <th class="text-left px-5 py-4">Payment Method</th>
              <th class="text-right px-5 py-4">Amount (₦)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400">No contribution records found.</td>
            </tr>
            <tr v-for="c in filtered" :key="c.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 text-gray-600">{{ c.date }}</td>
              <td class="px-5 py-4 text-gray-700">{{ c.type }}</td>
              <td class="px-5 py-4 text-gray-600">{{ c.paymentMethod }}</td>
              <td class="px-5 py-4 text-right font-semibold text-green-700">₦{{ fmt(c.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
