<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-in" data-aos-delay="20">
      <div>
        <h1 class="text-[27px] font-medium">Loans</h1>
        <p class="text-gray-600 mt-1">Manage loan applications, approvals, repayments, and schedules.</p>
      </div>
      <div class="flex gap-3">
        <button @click="openAddModal"
          class="bg-linear-to-r from-green-600 to-green-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:to-green-900 transition shadow">
          + New Loan
        </button>
        <button @click="exportLoans"
          class="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition">
          Export CSV
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-xl transition">
        <p class="text-sm text-gray-600">Total Issued</p>
        <p class="text-2xl font-bold mt-1">₦{{ fmt(totalIssued) }}</p>
      </div>
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-xl transition">
        <p class="text-sm text-gray-600">Outstanding Balance</p>
        <p class="text-2xl font-bold mt-1 text-red-600">₦{{ fmt(totalOutstanding) }}</p>
      </div>
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-xl transition">
        <p class="text-sm text-gray-600">Active Loans</p>
        <p class="text-2xl font-bold mt-1">{{ loans.filter(l => l.approvalStatus === 'Approved' && l.completionStatus !== 'Completed').length }}</p>
      </div>
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-xl transition">
        <p class="text-sm text-gray-600">Pending Approval</p>
        <p class="text-2xl font-bold mt-1">{{ loans.filter(l => l.approvalStatus === 'Pending').length }}</p>
      </div>
    </div>

    <!-- Search -->
    <div class="flex justify-center bg-white shadow-md p-4 rounded-[40px]">
      <input v-model="searchQuery" type="search" placeholder="Search by member name or status"
        class="w-full sm:w-[70%] border border-green-200 rounded-[20px] px-4 py-2 focus:outline-none focus:border-green-300" />
    </div>

    <!-- Loans Table -->
    <div class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 border-b">
          <tr class="text-gray-600 text-sm">
            <th class="px-5 py-3 text-left">Loan ID</th>
            <th class="px-5 py-3 text-left">Member</th>
            <th class="px-5 py-3 text-right">Amount (₦)</th>
            <th class="px-5 py-3 text-center">Interest %</th>
            <th class="px-5 py-3 text-right">Outstanding (₦)</th>
            <th class="px-5 py-3 text-left">Purpose</th>
            <th class="px-5 py-3 text-center">Eligibility</th>
            <th class="px-5 py-3 text-center">Approval</th>
            <th class="px-5 py-3 text-center">Completion</th>
            <th class="px-5 py-3 text-center">Applied</th>
            <th class="px-5 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in filteredLoans" :key="loan.id" class="border-t hover:bg-gray-50">
            <td class="px-5 py-4 font-mono text-gray-500 text-xs">{{ loan.loanId }}</td>
            <td class="px-5 py-4 font-medium text-gray-800">{{ loan.member }}</td>
            <td class="px-5 py-4 text-right">₦{{ fmt(loan.loanAmount) }}</td>
            <td class="px-5 py-4 text-center">{{ loan.interestRate }}%</td>
            <td class="px-5 py-4 text-right" :class="loan.outstandingBalance > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'">
              ₦{{ fmt(loan.outstandingBalance) }}
            </td>
            <td class="px-5 py-4 text-gray-500 max-w-35 truncate">{{ loan.purpose || '—' }}</td>
            <td class="px-5 py-4 text-center">
              <span class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="loan.eligibilityStatus === 'Eligible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                {{ loan.eligibilityStatus }}
              </span>
            </td>
            <td class="px-5 py-4 text-center">
              <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="approvalClass(loan.approvalStatus)">
                {{ loan.approvalStatus }}
              </span>
            </td>
            <td class="px-5 py-4 text-center">
              <span class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="loan.completionStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                {{ loan.completionStatus }}
              </span>
            </td>
            <td class="px-5 py-4 text-center text-gray-500 text-xs">{{ loan.applicationDate || '—' }}</td>
            <td class="px-5 py-4">
              <div class="flex gap-1 justify-center flex-wrap">
                <button v-if="loan.approvalStatus === 'Pending'"
                  @click="approveLoan(loan)" class="text-green-600 border border-green-500 px-2 py-1 rounded text-xs font-medium hover:bg-green-50">Approve</button>
                <button v-if="loan.approvalStatus === 'Pending'"
                  @click="rejectLoan(loan)" class="text-red-500 border border-red-400 px-2 py-1 rounded text-xs font-medium hover:bg-red-50">Reject</button>
                <button v-if="loan.approvalStatus === 'Approved' && loan.completionStatus !== 'Completed'"
                  @click="openRepayModal(loan)" class="text-blue-600 border border-blue-500 px-2 py-1 rounded text-xs font-medium hover:bg-blue-50">Repay</button>
                <button @click="openEditModal(loan)"
                  class="text-gray-600 border border-gray-400 px-2 py-1 rounded text-xs font-medium hover:bg-gray-50">Edit</button>
                <button @click="deleteLoan(loan.id)"
                  class="text-red-500 border border-red-400 px-2 py-1 rounded text-xs font-medium hover:bg-red-50">Del</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredLoans.length === 0">
            <td colspan="11" class="text-center py-12 text-gray-400">No loan records found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Repayment History -->
    <div v-if="repayments.length" class="bg-white rounded-xl shadow overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="font-semibold text-gray-800">Repayment Log</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr class="text-gray-600">
              <th class="px-5 py-3 text-left">Repayment ID</th>
              <th class="px-5 py-3 text-left">Loan ID</th>
              <th class="px-5 py-3 text-left">Member</th>
              <th class="px-5 py-3 text-right">Amount Paid (₦)</th>
              <th class="px-5 py-3 text-right">Updated Balance (₦)</th>
              <th class="px-5 py-3 text-center">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in repayments" :key="r.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-3 font-mono text-gray-400 text-xs">{{ r.repaymentId }}</td>
              <td class="px-5 py-3 font-mono text-gray-400 text-xs">{{ r.loanId }}</td>
              <td class="px-5 py-3 font-medium text-gray-800">{{ r.memberName }}</td>
              <td class="px-5 py-3 text-right text-green-600 font-semibold">₦{{ fmt(r.amountPaid) }}</td>
              <td class="px-5 py-3 text-right" :class="r.updatedBalance > 0 ? 'text-red-500' : 'text-gray-400'">
                ₦{{ fmt(r.updatedBalance) }}
              </td>
              <td class="px-5 py-3 text-center text-gray-500">{{ r.paymentDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Loan Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showModal = false">
      <div class="bg-white rounded-xl p-8 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit Loan' : 'New Loan Application' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Member</label>
            <select v-model="form.memberId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option value="">— Select member —</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }} ({{ m.membershipId }})</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₦)</label>
              <input v-model.number="form.loanAmount" type="number" min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input v-model.number="form.interestRate" type="number" min="0" max="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <input v-model="form.purpose" placeholder="Brief statement of purpose"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Repayment Schedule (months)</label>
            <input v-model.number="form.repaymentSchedule" type="number" min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
            <select v-model="form.approvalStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">Completion Status</label>
            <select v-model="form.completionStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option>Active</option>
              <option>Completed</option>
              <option>Defaulted</option>
            </select>
          </div>
        </div>
        <!-- Eligibility check result -->
        <div v-if="eligibilityMsg" class="mt-4 p-3 rounded-lg text-sm"
          :class="eligibilityOk ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">
          {{ eligibilityMsg }}
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showModal = false" class="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button @click="saveLoan" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:to-green-900">
            {{ isEditing ? 'Update' : 'Submit Application' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Record Repayment Modal -->
    <div v-if="showRepayModal && repayTarget" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showRepayModal = false">
      <div class="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-xl">
        <h3 class="text-xl font-bold mb-2">Record Repayment</h3>
        <p class="text-gray-500 text-sm mb-6">
          {{ repayTarget.member }} &mdash; Loan {{ repayTarget.loanId }}<br />
          Outstanding: <span class="font-semibold text-red-600">₦{{ fmt(repayTarget.outstandingBalance) }}</span>
        </p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₦)</label>
            <input v-model.number="repayAmount" type="number" min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input v-model="repayDate" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showRepayModal = false" class="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button @click="saveRepayment" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold">Save</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Sidenav from '@/components/Sidenav.vue';
import { useMembers } from '@/composables/useMembers';

const { members } = useMembers();

// ── Loans ────────────────────────────────────────────────────────────────────
const loans = ref(JSON.parse(localStorage.getItem('cooperativeLoans') || '[]'));
watch(loans, val => localStorage.setItem('cooperativeLoans', JSON.stringify(val)), { deep: true });

// ── Repayments ───────────────────────────────────────────────────────────────
const repayments = ref(JSON.parse(localStorage.getItem('cooperativeLoanRepayments') || '[]'));
watch(repayments, val => localStorage.setItem('cooperativeLoanRepayments', JSON.stringify(val)), { deep: true });

const searchQuery = ref('');

const filteredLoans = computed(() => {
  if (!searchQuery.value.trim()) return loans.value;
  const q = searchQuery.value.toLowerCase();
  return loans.value.filter(l =>
    (l.member || '').toLowerCase().includes(q) ||
    (l.approvalStatus || '').toLowerCase().includes(q) ||
    (l.completionStatus || '').toLowerCase().includes(q)
  );
});

const totalIssued = computed(() => loans.value.reduce((s, l) => s + Number(l.loanAmount || 0), 0));
const totalOutstanding = computed(() => loans.value.reduce((s, l) => s + Number(l.outstandingBalance || 0), 0));

const fmt = n => Number(n || 0).toLocaleString();

const approvalClass = status => ({
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-600');

// ── Eligibility check ────────────────────────────────────────────────────────
const checkEligibility = (memberId) => {
  const member = members.value.find(m => m.id === memberId);
  if (!member) return { ok: false, msg: 'Member not found.' };
  if (Number(member.totalContributions || 0) <= 0)
    return { ok: false, msg: 'Member has no recorded contributions — not eligible.' };
  const hasActiveLoan = loans.value.some(l =>
    l.memberId === memberId &&
    l.approvalStatus === 'Approved' &&
    l.completionStatus !== 'Completed'
  );
  if (hasActiveLoan)
    return { ok: false, msg: 'Member already has an active loan — not eligible.' };
  return { ok: true, msg: 'Member is eligible for a loan.' };
};

// ── Modal state ──────────────────────────────────────────────────────────────
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const eligibilityMsg = ref('');
const eligibilityOk = ref(false);

const blankForm = () => ({
  memberId: '',
  loanAmount: 0,
  interestRate: 5,
  purpose: '',
  repaymentSchedule: 6,
  approvalStatus: 'Pending',
  completionStatus: 'Active'
});

const form = ref(blankForm());

watch(() => form.value.memberId, (id) => {
  if (!id || isEditing.value) { eligibilityMsg.value = ''; return; }
  const result = checkEligibility(id);
  eligibilityOk.value = result.ok;
  eligibilityMsg.value = result.msg;
});

const nextLoanId = () => {
  const nums = loans.value.map(l => parseInt((l.loanId || '').replace(/\D/g, '')) || 0);
  return 'LN-' + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4, '0');
};

const openAddModal = () => {
  isEditing.value = false;
  form.value = blankForm();
  eligibilityMsg.value = '';
  showModal.value = true;
};

const openEditModal = (loan) => {
  isEditing.value = true;
  editingId.value = loan.id;
  form.value = { ...loan };
  eligibilityMsg.value = '';
  showModal.value = true;
};

const saveLoan = () => {
  if (!form.value.memberId) { alert('Please select a member.'); return; }
  const member = members.value.find(m => m.id === form.value.memberId);
  if (!member) { alert('Member not found.'); return; }

  const eligibility = checkEligibility(form.value.memberId);

  if (isEditing.value) {
    const idx = loans.value.findIndex(l => l.id === editingId.value);
    if (idx !== -1) loans.value[idx] = { ...loans.value[idx], ...form.value };
  } else {
    loans.value.push({
      id: Date.now(),
      loanId: nextLoanId(),
      memberId: form.value.memberId,
      member: member.name,
      loanAmount: form.value.loanAmount,
      interestRate: form.value.interestRate,
      purpose: form.value.purpose,
      repaymentSchedule: form.value.repaymentSchedule,
      outstandingBalance: form.value.loanAmount,
      eligibilityStatus: eligibility.ok ? 'Eligible' : 'Ineligible',
      approvalStatus: 'Pending',
      completionStatus: 'Active',
      applicationDate: new Date().toLocaleDateString('en-NG')
    });
  }
  showModal.value = false;
};

const approveLoan = (loan) => {
  loan.approvalStatus = 'Approved';
  localStorage.setItem('cooperativeLoans', JSON.stringify(loans.value));
};

const rejectLoan = (loan) => {
  loan.approvalStatus = 'Rejected';
  localStorage.setItem('cooperativeLoans', JSON.stringify(loans.value));
};

const deleteLoan = (id) => {
  if (!confirm('Delete this loan record?')) return;
  loans.value = loans.value.filter(l => l.id !== id);
};

// ── Repayment ────────────────────────────────────────────────────────────────
const showRepayModal = ref(false);
const repayTarget = ref(null);
const repayAmount = ref(0);
const repayDate = ref('');

const nextRepayId = () => {
  const nums = repayments.value.map(r => parseInt((r.repaymentId || '').replace(/\D/g, '')) || 0);
  return 'REP-' + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4, '0');
};

const openRepayModal = (loan) => {
  repayTarget.value = loan;
  repayAmount.value = 0;
  repayDate.value = new Date().toISOString().split('T')[0];
  showRepayModal.value = true;
};

const saveRepayment = () => {
  if (!repayAmount.value || repayAmount.value <= 0) { alert('Enter a valid payment amount.'); return; }
  const loan = loans.value.find(l => l.id === repayTarget.value.id);
  if (!loan) return;

  const newBalance = Math.max(0, Number(loan.outstandingBalance) - repayAmount.value);
  repayments.value.push({
    id: Date.now(),
    repaymentId: nextRepayId(),
    loanId: loan.loanId,
    memberId: loan.memberId,
    memberName: loan.member,
    amountPaid: repayAmount.value,
    updatedBalance: newBalance,
    paymentDate: new Date(repayDate.value + 'T00:00:00').toLocaleDateString('en-NG')
  });

  loan.outstandingBalance = newBalance;
  if (newBalance === 0) loan.completionStatus = 'Completed';
  showRepayModal.value = false;
};

const exportLoans = () => {
  const rows = ['Loan ID,Member,Amount (N),Interest %,Outstanding (N),Eligibility,Approval,Completion,Date,Purpose',
    ...loans.value.map(l =>
      [l.loanId, l.member, l.loanAmount, l.interestRate, l.outstandingBalance,
       l.eligibilityStatus, l.approvalStatus, l.completionStatus, l.applicationDate || '', l.purpose || ''].join(',')
    )
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'loans.csv';
  a.click();
};
</script>
