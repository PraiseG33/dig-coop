<script setup>
import PortalSidenav from '@/components/PortalSidenav.vue'
import { computed, ref } from 'vue'
import { useMembers } from '@/composables/useMembers'

const { members } = useMembers()

const session = computed(() => {
  const raw = localStorage.getItem('dcms_session') || sessionStorage.getItem('dcms_session')
  try { return raw ? JSON.parse(raw) : {} } catch { return {} }
})

const member = computed(() => members.value.find(m => m.id === session.value.memberId) || {})

const all = JSON.parse(localStorage.getItem('cooperativeSavings') || '[]')
const transactions = computed(() =>
  all.filter(s => s.memberId === session.value.memberId).sort((a, b) => new Date(b.date) - new Date(a.date))
)

const searchQuery = ref('')
const filtered = computed(() => {
  if (!searchQuery.value.trim()) return transactions.value
  const q = searchQuery.value.toLowerCase()
  return transactions.value.filter(s =>
    (s.type || '').toLowerCase().includes(q) ||
    (s.method || '').toLowerCase().includes(q) ||
    (s.date || '').includes(q)
  )
})

const fmt = n => Number(n || 0).toLocaleString()

const totalDeposits = computed(() =>
  transactions.value.filter(s => s.type === 'Deposit').reduce((sum, s) => sum + Number(s.amount || 0), 0)
)
const totalWithdrawals = computed(() =>
  transactions.value.filter(s => s.type === 'Withdrawal').reduce((sum, s) => sum + Number(s.amount || 0), 0)
)
</script>

<template>
  <PortalSidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <div>
      <h1 class="text-[27px] font-medium">My Savings</h1>
      <p class="text-gray-400 font-semibold">Your savings balance and transaction history.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Current Balance</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ fmt(member.savingsAmount) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Deposits</p>
        <p class="text-2xl font-bold text-green-700">₦{{ fmt(totalDeposits) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md text-center">
        <p class="text-sm text-gray-500 mb-1">Total Withdrawals</p>
        <p class="text-2xl font-bold text-red-600">₦{{ fmt(totalWithdrawals) }}</p>
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
              <th class="text-left px-5 py-4">Method</th>
              <th class="text-right px-5 py-4">Amount (₦)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400">No savings transactions found.</td>
            </tr>
            <tr v-for="s in filtered" :key="s.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 text-gray-600">{{ s.date }}</td>
              <td class="px-5 py-4 text-gray-700">{{ s.type }}</td>
              <td class="px-5 py-4 text-gray-600">{{ s.method }}</td>
              <td class="px-5 py-4 text-right font-semibold" :class="s.type === 'Withdrawal' ? 'text-red-600' : 'text-green-700'">
                {{ s.type === 'Withdrawal' ? '-' : '+' }}₦{{ fmt(s.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
