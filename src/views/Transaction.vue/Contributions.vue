<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6">

    <!-- Header + Export Button -->
    <div class="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
      <div>
        <h1 class="text-[27px] font-medium">Member Contributions</h1>
        <p class="text-gray-600 mt-1">Record and track all cooperative contributions.</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="openAddModal"
          class="bg-linear-to-r from-green-600 to-green-800 text-white py-2 px-5 rounded-lg font-semibold transition hover:to-green-900 shadow"
        >
          + Record Contribution
        </button>
        <button
          @click="exportContributions"
          class="border border-blue-600 hover:bg-blue-50 text-blue-600 py-2 px-5 rounded-lg font-medium transition"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">Total Contributions</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ formatNumber(totalContributions) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">This Month</p>
        <p class="text-2xl font-bold text-gray-800">₦{{ formatNumber(thisMonthContributions) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">Active Contributors</p>
        <p class="text-2xl font-bold text-gray-800">{{ activeContributors }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
        <p class="text-gray-600 text-sm mb-2">Last Contribution</p>
        <p class="text-lg font-bold text-gray-800">{{ lastContributionDate || '—' }}</p>
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

    <!-- Contributions Table -->
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
              <th class="text-center px-6 py-4">Payment Method</th>
              <th class="text-center px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in filteredContributions"
              :key="c.id + '-' + c.recordDate"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">{{ c.name }}</td>
              <td class="px-6 py-4 text-gray-500">#{{ c.id }}</td>
              <td class="px-6 py-4 font-medium">₦{{ formatNumber(c.amount) }}</td>
              <td class="px-6 py-4 text-center">{{ c.type }}</td>
              <td class="px-6 py-4 text-center">{{ c.recordDate || '—' }}</td>
              <td class="px-6 py-4 text-center">{{ c.paymentMethod || '—' }}</td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="c.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ c.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredContributions.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">No contributions found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Record Contribution Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-xl">
        <h3 class="text-xl font-bold mb-6">Record Contribution</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Member</label>
            <select v-model="form.memberId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option value="">— Select member —</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
            <input v-model.number="form.amount" type="number" min="1" placeholder="e.g. 5000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contribution Type</label>
              <select v-model="form.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                <option>Monthly</option>
                <option>Special Levy</option>
                <option>Development</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select v-model="form.paymentMethod"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Mobile Money</option>
                <option>Cheque</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="form.date" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showModal = false" class="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button @click="saveContribution" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:to-green-900">Save</button>
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
const form = ref({ memberId: '', amount: 0, type: 'Monthly', paymentMethod: 'Cash', date: '' });

// Build a flat list of contribution records from members + extra records
// Extra records stored separately so we don't lose individual payment dates
const extraRecords = ref(JSON.parse(localStorage.getItem('cooperativeContributions') || '[]'));

const saveExtraRecords = () => {
  localStorage.setItem('cooperativeContributions', JSON.stringify(extraRecords.value));
};

const openAddModal = () => {
  form.value = {
    memberId: '',
    amount: 0,
    type: 'Monthly',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0]
  };
  showModal.value = true;
};

const saveContribution = () => {
  if (!form.value.memberId) { alert('Please select a member.'); return; }
  if (!form.value.amount || form.value.amount <= 0) { alert('Please enter a valid amount.'); return; }

  const member = members.value.find(m => m.id === form.value.memberId);
  if (!member) return;

  // Add to the extra records log
  extraRecords.value.push({
    id: Date.now(),
    memberId: member.id,
    memberName: member.name,
    amount: form.value.amount,
    type: form.value.type,
    paymentMethod: form.value.paymentMethod,
    date: form.value.date,
    status: 'Paid'
  });
  saveExtraRecords();

  // Also update member's cumulative total
  member.totalContributions = (Number(member.totalContributions) || 0) + form.value.amount;

  showModal.value = false;
};

// Contributions list: individual records from extra log, plus base member totals for members with no log entries
const contributions = computed(() => {
  if (extraRecords.value.length) {
    return extraRecords.value.map(r => ({
      id: r.memberId,
      name: r.memberName,
      amount: r.amount,
      type: r.type,
      recordDate: formatDate(r.date),
      paymentMethod: r.paymentMethod,
      status: 'Paid'
    }));
  }
  // Fallback: derive from member totals
  return members.value.map(m => ({
    id: m.id,
    name: m.name,
    amount: m.totalContributions || 0,
    type: 'Monthly',
    recordDate: '—',
    paymentMethod: '—',
    status: m.totalContributions > 0 ? 'Paid' : 'Unpaid'
  }));
});

const filteredContributions = computed(() =>
  contributions.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const totalContributions = computed(() =>
  members.value.reduce((sum, m) => sum + Number(m.totalContributions || 0), 0)
);

const thisMonthContributions = computed(() => {
  const now = new Date();
  return extraRecords.value
    .filter(r => {
      if (!r.date) return false;
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + r.amount, 0);
});

const activeContributors = computed(() =>
  members.value.filter(m => Number(m.totalContributions) > 0).length
);

const lastContributionDate = computed(() => {
  if (!extraRecords.value.length) return null;
  const sorted = [...extraRecords.value].sort((a, b) => new Date(b.date) - new Date(a.date));
  return formatDate(sorted[0].date);
});

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};
const formatNumber = (num) => Number(num || 0).toLocaleString();

const exportContributions = () => {
  const data = filteredContributions.value;
  const rows = data.map(c => [c.name, c.id, c.amount, c.type, c.recordDate, c.paymentMethod, c.status].join(','));
  const csv = ['Name,Member ID,Amount,Type,Date,Payment Method,Status', ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'contributions.csv');
  link.click();
};
</script>
