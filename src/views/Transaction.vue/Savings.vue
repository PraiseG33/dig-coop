<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6">

    <!-- Header + Export Button -->
    <div class="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4" data-aos="fade-in" data-aos-delay="20">
      <div>
        <h1 class="text-[27px] font-medium">Member Savings</h1>
        <p class="font-semibold text-gray-400">Record and track all cooperative savings deposits and withdrawals.</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="openAddModal"
          class="bg-linear-to-r from-green-600 to-green-800 text-white py-2 px-5 rounded-lg font-semibold transition hover:to-green-900 shadow"
        >
          + Record Transaction
        </button>
        <button
          @click="exportSavings"
          class="border border-blue-600 hover:bg-blue-50 text-blue-600 py-2 px-5 rounded-lg font-medium transition"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">Total Savings Balance</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ formatNumber(totalSavings) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">This Month (Net)</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ formatNumber(thisMonthNet) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">Members with Savings</p>
        <p class="text-2xl font-bold text-gray-800">{{ activeSavers }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">Last Transaction</p>
        <p class="text-lg font-bold text-gray-800">{{ lastTransactionDate || '—' }}</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex flex-col sm:flex-row justify-center gap-4 items-center bg-white shadow-md p-5 rounded-[40px] mb-8">
      <input
        type="search"
        v-model="searchQuery"
        placeholder="Search by member name"
        class="w-full sm:w-[70%] border border-green-200 rounded-[20px] px-4 py-2 focus:outline-none focus:border-green-300"
      />
    </div>

    <!-- Savings Table -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-600 text-sm">
              <th class="text-left px-6 py-4">Name</th>
              <th class="text-left px-6 py-4">Member ID</th>
              <th class="text-left px-6 py-4">Amount (₦)</th>
              <th class="text-center px-6 py-4">Type</th>
              <th class="text-center px-6 py-4">Date</th>
              <th class="text-center px-6 py-4">Method</th>
              <th class="text-center px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in filteredSavings"
              :key="s.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">{{ s.name }}</td>
              <td class="px-6 py-4 text-gray-500">#{{ s.memberId }}</td>
              <td class="px-6 py-4 font-medium" :class="s.type === 'Withdrawal' ? 'text-red-600' : 'text-green-700'">
                {{ s.type === 'Withdrawal' ? '-' : '+' }}₦{{ formatNumber(s.amount) }}
              </td>
              <td class="px-6 py-4 text-center">{{ s.type }}</td>
              <td class="px-6 py-4 text-center">{{ formatDate(s.date) }}</td>
              <td class="px-6 py-4 text-center">{{ s.method || '—' }}</td>
              <td class="px-6 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {{ s.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredSavings.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">No savings transactions found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Record Transaction Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-xl">
        <h3 class="text-xl font-bold mb-6">Record Savings Transaction</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Member</label>
            <select v-model="form.memberId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option value="">— Select member —</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }} (₦{{ formatNumber(m.savingsAmount) }})</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="form.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                <option>Deposit</option>
                <option>Withdrawal</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
              <input v-model.number="form.amount" type="number" min="1" placeholder="e.g. 5000"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
            </div>
          </div>
          <div v-if="selectedMemberBalance !== null && form.type === 'Withdrawal' && form.amount > selectedMemberBalance"
            class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            This exceeds the member's current savings balance of ₦{{ formatNumber(selectedMemberBalance) }}.
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select v-model="form.method"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Mobile Money</option>
              <option>Cheque</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="form.date" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showModal = false" class="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button @click="saveTransaction" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:to-green-900">Save</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import Sidenav from '@/components/Sidenav.vue';
import { ref, computed } from 'vue';
import { useMembers } from '@/composables/useMembers';

const { members } = useMembers();
const searchQuery = ref('');
const showModal = ref(false);
const form = ref({ memberId: '', amount: 0, type: 'Deposit', method: 'Cash', date: '' });

// Individual savings transactions, kept separately so we have a real history
// (member.savingsAmount is a derived running balance, updated below)
const records = ref(JSON.parse(localStorage.getItem('cooperativeSavings') || '[]'));

const saveRecords = () => {
  localStorage.setItem('cooperativeSavings', JSON.stringify(records.value));
};

const openAddModal = () => {
  form.value = {
    memberId: '',
    amount: 0,
    type: 'Deposit',
    method: 'Cash',
    date: new Date().toISOString().split('T')[0]
  };
  showModal.value = true;
};

const selectedMemberBalance = computed(() => {
  const m = members.value.find(m => m.id === form.value.memberId);
  return m ? Number(m.savingsAmount || 0) : null;
});

const saveTransaction = () => {
  if (!form.value.memberId) { alert('Please select a member.'); return; }
  if (!form.value.amount || form.value.amount <= 0) { alert('Please enter a valid amount.'); return; }

  const member = members.value.find(m => m.id === form.value.memberId);
  if (!member) return;

  const currentBalance = Number(member.savingsAmount || 0);

  if (form.value.type === 'Withdrawal' && form.value.amount > currentBalance) {
    alert("This withdrawal exceeds the member's current savings balance.");
    return;
  }

  records.value.push({
    id: Date.now(),
    memberId: member.id,
    memberName: member.name,
    amount: form.value.amount,
    type: form.value.type,
    method: form.value.method,
    date: form.value.date,
    status: 'Completed'
  });
  saveRecords();

  // Update member's running savings balance — deposits add, withdrawals subtract, floored at 0
  member.savingsAmount = form.value.type === 'Withdrawal'
    ? Math.max(0, currentBalance - form.value.amount)
    : currentBalance + form.value.amount;

  showModal.value = false;
};

const savingsList = computed(() =>
  records.value.map(r => ({
    id: r.id,
    memberId: r.memberId,
    name: r.memberName,
    amount: r.amount,
    type: r.type,
    date: r.date,
    method: r.method,
    status: r.status
  })).sort((a, b) => new Date(b.date) - new Date(a.date))
);

const filteredSavings = computed(() =>
  savingsList.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const totalSavings = computed(() =>
  members.value.reduce((sum, m) => sum + Number(m.savingsAmount || 0), 0)
);

const thisMonthNet = computed(() => {
  const now = new Date();
  return records.value
    .filter(r => {
      if (!r.date) return false;
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + (r.type === 'Withdrawal' ? -r.amount : r.amount), 0);
});

const activeSavers = computed(() =>
  members.value.filter(m => Number(m.savingsAmount) > 0).length
);

const lastTransactionDate = computed(() => {
  if (!records.value.length) return null;
  const sorted = [...records.value].sort((a, b) => new Date(b.date) - new Date(a.date));
  return formatDate(sorted[0].date);
});

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};
const formatNumber = (num) => Number(num || 0).toLocaleString();

const exportSavings = () => {
  const data = filteredSavings.value;
  const rows = data.map(s => [s.name, s.memberId, s.amount, s.type, s.date, s.method, s.status].join(','));
  const csv = ['Name,Member ID,Amount,Type,Date,Method,Status', ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'savings.csv');
  link.click();
};
</script>
