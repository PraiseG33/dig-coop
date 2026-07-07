<script setup>
import PortalSidenav from '@/components/PortalSidenav.vue'
import { computed } from 'vue'

const session = computed(() => {
  const raw = localStorage.getItem('dcms_session') || sessionStorage.getItem('dcms_session')
  try { return raw ? JSON.parse(raw) : {} } catch { return {} }
})

const allLoans = JSON.parse(localStorage.getItem('cooperativeLoans') || '[]')
const allRepayments = JSON.parse(localStorage.getItem('cooperativeLoanRepayments') || '[]')

const loans = computed(() => allLoans.filter(l => l.memberId === session.value.memberId))

const repayments = computed(() => allRepayments.filter(r =>
  loans.value.some(l => l.id === r.loanId)
))

const fmt = n => Number(n || 0).toLocaleString()

const statusClass = (status) => ({
  'Approved': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Fully Paid': 'bg-blue-100 text-blue-700',
  'Rejected': 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-700')
</script>

<template>
  <PortalSidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <div>
      <h1 class="text-[27px] font-medium">My Loans</h1>
      <p class="text-gray-400 font-semibold">Your loan applications and repayment history.</p>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Loans</p>
        <p class="text-2xl font-bold text-gray-800">{{ loans.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Active Loans</p>
        <p class="text-2xl font-bold text-gray-800">{{ loans.filter(l => l.status === 'Approved').length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Repaid</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(repayments.reduce((s,r) => s + Number(r.amount||0), 0)) }}</p>
      </div>
    </div>

    <!-- Loans Table -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="font-semibold text-gray-700">Loan Applications</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-500">
              <th class="text-left px-5 py-4">Loan ID</th>
              <th class="text-left px-5 py-4">Date</th>
              <th class="text-right px-5 py-4">Amount (₦)</th>
              <th class="text-right px-5 py-4">Balance (₦)</th>
              <th class="text-center px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loans.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400">No loan records found.</td>
            </tr>
            <tr v-for="l in loans" :key="l.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 font-mono text-gray-500">{{ l.loanId || l.id }}</td>
              <td class="px-5 py-4 text-gray-600">{{ l.date }}</td>
              <td class="px-5 py-4 text-right font-medium text-gray-800">₦{{ fmt(l.amount) }}</td>
              <td class="px-5 py-4 text-right font-medium text-red-600">₦{{ fmt(l.balance) }}</td>
              <td class="px-5 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass(l.status)">
                  {{ l.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Repayments Table -->
    <div v-if="repayments.length > 0" class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="font-semibold text-gray-700">Repayment History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-500">
              <th class="text-left px-5 py-4">Date</th>
              <th class="text-left px-5 py-4">Method</th>
              <th class="text-right px-5 py-4">Amount (₦)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in repayments" :key="r.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 text-gray-600">{{ r.date }}</td>
              <td class="px-5 py-4 text-gray-700">{{ r.method || '—' }}</td>
              <td class="px-5 py-4 text-right font-semibold text-green-700">₦{{ fmt(r.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
