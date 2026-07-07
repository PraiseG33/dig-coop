<script setup>
import PortalSidenav from '@/components/PortalSidenav.vue'
import { computed } from 'vue'

const session = computed(() => {
  const raw = localStorage.getItem('dcms_session') || sessionStorage.getItem('dcms_session')
  try { return raw ? JSON.parse(raw) : {} } catch { return {} }
})

const allComputations = JSON.parse(localStorage.getItem('cooperativeDividendComputations') || '[]')

const myDividends = computed(() =>
  allComputations.flatMap(comp =>
    (comp.records || [])
      .filter(r => r.memberId === session.value.memberId)
      .map(r => ({ ...r, poolTotal: comp.pool, computedAt: comp.computedAt }))
  )
)

const totalEarned = computed(() => myDividends.value.reduce((s, d) => s + Number(d.weightedDividendAmount || 0), 0))
const fmt = n => Number(n || 0).toLocaleString()

const statusClass = (status) => ({
  'Distributed': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
}[status] || 'bg-gray-100 text-gray-600')
</script>

<template>
  <PortalSidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <div>
      <h1 class="text-[27px] font-medium">My Dividends</h1>
      <p class="text-gray-400 font-semibold">Dividend allocations computed for you.</p>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Dividends Earned</p>
        <p class="text-3xl font-bold text-green-700">₦{{ fmt(totalEarned) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Computation Periods</p>
        <p class="text-3xl font-bold text-gray-800">{{ myDividends.length }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-500">
              <th class="text-left px-5 py-4">Dividend ID</th>
              <th class="text-left px-5 py-4">Period</th>
              <th class="text-left px-5 py-4">Computed On</th>
              <th class="text-right px-5 py-4">Contributions (₦)</th>
              <th class="text-center px-5 py-4">Attendance %</th>
              <th class="text-right px-5 py-4">Dividend (₦)</th>
              <th class="text-center px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="myDividends.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-400">No dividend records yet.</td>
            </tr>
            <tr v-for="d in myDividends" :key="d.dividendId" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 font-mono text-gray-500 text-xs">{{ d.dividendId }}</td>
              <td class="px-5 py-4 text-gray-700">{{ d.computationPeriod }}</td>
              <td class="px-5 py-4 text-gray-500 text-xs">{{ d.computationDate }}</td>
              <td class="px-5 py-4 text-right text-gray-800">₦{{ fmt(d.totalContributionAmount) }}</td>
              <td class="px-5 py-4 text-center text-gray-700">{{ d.attendanceScore }}%</td>
              <td class="px-5 py-4 text-right font-bold text-green-700">₦{{ fmt(d.weightedDividendAmount) }}</td>
              <td class="px-5 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass(d.distributionStatus)">
                  {{ d.distributionStatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
