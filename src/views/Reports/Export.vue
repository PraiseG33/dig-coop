<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-6">

    <!-- Header -->
    <div>
      <h1 class="text-[27px] font-medium">Export Data</h1>
      <p class="text-gray-600 mt-1">Download cooperative records as CSV files for offline use or external reporting.</p>
    </div>

    <!-- Export Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

      <!-- Members -->
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Members</h2>
            <p class="text-sm text-gray-500">{{ members.length }} records</p>
          </div>
        </div>
        <p class="text-sm text-gray-600">Full member directory: Membership ID, name, gender, DOB, phone, email, savings, contributions, meetings, badge.</p>
        <div class="flex gap-3 mt-auto">
          <button @click="previewSection = previewSection === 'members' ? null : 'members'"
            class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            {{ previewSection === 'members' ? 'Hide' : 'Preview' }}
          </button>
          <button @click="exportMembers"
            class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg text-sm font-semibold hover:to-blue-800">
            Export CSV
          </button>
        </div>
        <div v-if="previewSection === 'members'" class="overflow-x-auto text-xs border border-gray-100 rounded-lg bg-gray-50 p-3 max-h-52 overflow-y-auto">
          <table class="w-full">
            <thead><tr class="text-gray-500 border-b">
              <th class="text-left py-1 pr-3">ID</th>
              <th class="text-left py-1 pr-3">Name</th>
              <th class="text-left py-1 pr-3">Gender</th>
              <th class="text-right py-1 pr-3">Contrib (₦)</th>
              <th class="text-right py-1">Savings (₦)</th>
            </tr></thead>
            <tbody>
              <tr v-for="m in members" :key="m.id" class="border-b border-gray-100">
                <td class="py-1 pr-3 font-mono text-gray-400">{{ m.membershipId }}</td>
                <td class="py-1 pr-3 font-medium">{{ m.name }}</td>
                <td class="py-1 pr-3 text-gray-500">{{ m.gender || '—' }}</td>
                <td class="py-1 pr-3 text-right">₦{{ fmt(m.totalContributions) }}</td>
                <td class="py-1 text-right">₦{{ fmt(m.savingsAmount) }}</td>
              </tr>
              <tr v-if="!members.length"><td colspan="5" class="py-3 text-center text-gray-400">No members.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Loans -->
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Loans</h2>
            <p class="text-sm text-gray-500">{{ loans.length }} records · {{ repayments.length }} repayments</p>
          </div>
        </div>
        <p class="text-sm text-gray-600">Full loan data: Loan ID, member, amount, interest, eligibility, approval, completion, outstanding balance, purpose.</p>
        <div class="flex gap-3 mt-auto">
          <button @click="previewSection = previewSection === 'loans' ? null : 'loans'"
            class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            {{ previewSection === 'loans' ? 'Hide' : 'Preview' }}
          </button>
          <button @click="exportLoans"
            class="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg text-sm font-semibold hover:to-blue-900">
            Export CSV
          </button>
        </div>
        <div v-if="previewSection === 'loans'" class="overflow-x-auto text-xs border border-gray-100 rounded-lg bg-gray-50 p-3 max-h-52 overflow-y-auto">
          <table class="w-full">
            <thead><tr class="text-gray-500 border-b">
              <th class="text-left py-1 pr-2">Loan ID</th>
              <th class="text-left py-1 pr-2">Member</th>
              <th class="text-right py-1 pr-2">Amount</th>
              <th class="text-center py-1">Approval</th>
            </tr></thead>
            <tbody>
              <tr v-for="l in loans" :key="l.id" class="border-b border-gray-100">
                <td class="py-1 pr-2 font-mono text-gray-400">{{ l.loanId }}</td>
                <td class="py-1 pr-2 font-medium">{{ l.member }}</td>
                <td class="py-1 pr-2 text-right">₦{{ fmt(l.loanAmount) }}</td>
                <td class="py-1 text-center">{{ l.approvalStatus }}</td>
              </tr>
              <tr v-if="!loans.length"><td colspan="4" class="py-3 text-center text-gray-400">No loans.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Contributions -->
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-green-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Contributions</h2>
            <p class="text-sm text-gray-500">{{ contributions.length }} records</p>
          </div>
        </div>
        <p class="text-sm text-gray-600">Contribution ID, Member ID, amount, date, payment method, status.</p>
        <div class="flex gap-3 mt-auto">
          <button @click="previewSection = previewSection === 'contributions' ? null : 'contributions'"
            class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            {{ previewSection === 'contributions' ? 'Hide' : 'Preview' }}
          </button>
          <button @click="exportContributions"
            class="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white py-2 rounded-lg text-sm font-semibold hover:to-green-900">
            Export CSV
          </button>
        </div>
        <div v-if="previewSection === 'contributions'" class="overflow-x-auto text-xs border border-gray-100 rounded-lg bg-gray-50 p-3 max-h-52 overflow-y-auto">
          <table class="w-full">
            <thead><tr class="text-gray-500 border-b">
              <th class="text-left py-1 pr-3">Member</th>
              <th class="text-right py-1 pr-3">Amount (₦)</th>
              <th class="text-center py-1 pr-3">Date</th>
              <th class="text-center py-1">Method</th>
            </tr></thead>
            <tbody>
              <tr v-for="c in contributions" :key="c.id" class="border-b border-gray-100">
                <td class="py-1 pr-3 font-medium">{{ c.memberName }}</td>
                <td class="py-1 pr-3 text-right">₦{{ fmt(c.amount) }}</td>
                <td class="py-1 pr-3 text-center text-gray-500">{{ c.date }}</td>
                <td class="py-1 text-center text-gray-500">{{ c.paymentMethod }}</td>
              </tr>
              <tr v-if="!contributions.length"><td colspan="4" class="py-3 text-center text-gray-400">No contributions recorded.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Attendance -->
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-purple-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Attendance</h2>
            <p class="text-sm text-gray-500">{{ meetings.length }} meeting sessions</p>
          </div>
        </div>
        <p class="text-sm text-gray-600">Attendance ID, Member ID, meeting date, attendance status, check-in method.</p>
        <div class="flex gap-3 mt-auto">
          <button @click="previewSection = previewSection === 'attendance' ? null : 'attendance'"
            class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            {{ previewSection === 'attendance' ? 'Hide' : 'Preview' }}
          </button>
          <button @click="exportAttendance"
            class="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 rounded-lg text-sm font-semibold hover:to-purple-900">
            Export CSV
          </button>
        </div>
        <div v-if="previewSection === 'attendance'" class="overflow-x-auto text-xs border border-gray-100 rounded-lg bg-gray-50 p-3 max-h-52 overflow-y-auto">
          <table class="w-full">
            <thead><tr class="text-gray-500 border-b">
              <th class="text-left py-1 pr-3">Meeting</th>
              <th class="text-center py-1 pr-3">Date</th>
              <th class="text-center py-1 pr-3">Present</th>
              <th class="text-center py-1">Rate</th>
            </tr></thead>
            <tbody>
              <tr v-for="mtg in meetings" :key="mtg.id" class="border-b border-gray-100">
                <td class="py-1 pr-3 font-medium">{{ mtg.title }}</td>
                <td class="py-1 pr-3 text-center text-gray-500">{{ mtg.date }}</td>
                <td class="py-1 pr-3 text-center text-green-600 font-semibold">{{ countPresent(mtg) }}</td>
                <td class="py-1 text-center">{{ meetingRate(mtg) }}%</td>
              </tr>
              <tr v-if="!meetings.length"><td colspan="4" class="py-3 text-center text-gray-400">No meetings.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Full Report -->
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 sm:col-span-2">
        <div class="flex items-center gap-3">
          <div class="bg-orange-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Full Report</h2>
            <p class="text-sm text-gray-500">All data combined in one file</p>
          </div>
        </div>
        <p class="text-sm text-gray-600">
          Combines all sections — members, contributions, loans, repayments, attendance, and dividends — into a single comprehensive CSV export.
        </p>
        <div class="flex items-center justify-between mt-auto flex-wrap gap-3">
          <p class="text-xs text-gray-400">
            {{ members.length }} members &middot; {{ contributions.length }} contributions &middot;
            {{ loans.length }} loans &middot; {{ repayments.length }} repayments &middot;
            {{ meetings.length }} meetings
          </p>
          <button @click="exportAll"
            class="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:to-orange-800">
            Export Full Report CSV
          </button>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toastMsg" class="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50">
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidenav from '@/components/Sidenav.vue';
import { useMembers } from '@/composables/useMembers';

const { members } = useMembers();
const meetings = ref(JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'));
const loans = ref(JSON.parse(localStorage.getItem('cooperativeLoans') || '[]'));
const repayments = ref(JSON.parse(localStorage.getItem('cooperativeLoanRepayments') || '[]'));
const contributions = ref(JSON.parse(localStorage.getItem('cooperativeContributions') || '[]'));

const previewSection = ref(null);
const toastMsg = ref('');
const showToast = (msg) => { toastMsg.value = msg; setTimeout(() => { toastMsg.value = ''; }, 3000); };

const fmt = n => Number(n || 0).toLocaleString();
const countPresent = (mtg) => (mtg.records || []).filter(r => r.status === 'Present').length;
const meetingRate = (mtg) => members.value.length
  ? Math.round((countPresent(mtg) / members.value.length) * 100) : 0;

const dl = (filename, rows) => {
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  showToast(`✓ ${filename} downloaded`);
};

const exportMembers = () => {
  if (!members.value.length) { showToast('No members to export.'); return; }
  dl('members.csv', [
    'Membership ID,Full Name,Gender,Date of Birth,Phone,Email,Savings (N),Total Contributions (N),Meetings Attended,Badge',
    ...members.value.map(m =>
      [m.membershipId || '', m.name, m.gender || '', m.dob || '', m.phone,
       m.email || '', m.savingsAmount || 0, m.totalContributions || 0,
       m.meetingsAttended || 0, m.badge || 'New Member'].join(',')
    )
  ]);
};

const exportLoans = () => {
  if (!loans.value.length) { showToast('No loans to export.'); return; }
  dl('loans.csv', [
    'Loan ID,Member ID,Member,Loan Amount (N),Interest %,Outstanding Balance (N),Purpose,Eligibility,Approval,Completion,Application Date,Repayment Schedule (months)',
    ...loans.value.map(l =>
      [l.loanId, l.memberId, l.member, l.loanAmount, l.interestRate, l.outstandingBalance,
       l.purpose || '', l.eligibilityStatus, l.approvalStatus, l.completionStatus,
       l.applicationDate || '', l.repaymentSchedule || ''].join(',')
    ),
    '',
    'REPAYMENTS',
    'Repayment ID,Loan ID,Member ID,Member,Amount Paid (N),Updated Balance (N),Payment Date',
    ...repayments.value.map(r =>
      [r.repaymentId, r.loanId, r.memberId, r.memberName, r.amountPaid, r.updatedBalance, r.paymentDate].join(',')
    )
  ]);
};

const exportContributions = () => {
  if (!contributions.value.length && !members.value.length) { showToast('No data to export.'); return; }
  const rows = contributions.value.length
    ? ['Contribution ID,Member ID,Member,Amount (N),Date,Payment Method,Status',
       ...contributions.value.map(c =>
         [c.id, c.memberId, c.memberName, c.amount, c.date || '', c.paymentMethod || '', 'Paid'].join(',')
       )]
    : ['Member ID,Member,Total Contributions (N)',
       ...members.value.map(m => [m.id, m.name, m.totalContributions || 0].join(','))];
  dl('contributions.csv', rows);
};

const exportAttendance = () => {
  if (!meetings.value.length) { showToast('No attendance records.'); return; }
  const rows = ['Attendance ID,Meeting,Meeting Date,Member ID,Member,Status,Check-in Method'];
  let seq = 1;
  meetings.value.forEach(mtg => {
    (mtg.records || []).forEach(rec => {
      const m = members.value.find(mb => mb.id === rec.memberId);
      rows.push(['ATT-' + String(seq++).padStart(5, '0'), mtg.title, mtg.date,
        rec.memberId, m ? m.name : rec.memberId, rec.status, rec.method].join(','));
    });
  });
  dl('attendance.csv', rows);
};

const exportAll = () => {
  const ts = new Date().toLocaleDateString('en-NG');
  const rows = [
    'DIGITAL COOPERATIVE MANAGEMENT SYSTEM - FULL REPORT',
    `Generated: ${ts}`,
    '',
    '=== MEMBERS ===',
    'Membership ID,Name,Gender,DOB,Phone,Email,Savings (N),Contributions (N),Meetings,Badge',
    ...members.value.map(m =>
      [m.membershipId || '', m.name, m.gender || '', m.dob || '', m.phone,
       m.email || '', m.savingsAmount || 0, m.totalContributions || 0,
       m.meetingsAttended || 0, m.badge || ''].join(',')
    ),
    '',
    '=== CONTRIBUTIONS ===',
    ...( contributions.value.length
      ? ['Contribution ID,Member,Amount (N),Date,Method',
         ...contributions.value.map(c => [c.id, c.memberName, c.amount, c.date || '', c.paymentMethod || ''].join(','))]
      : ['No individual contribution records — see member totals above.']
    ),
    '',
    '=== LOANS ===',
    'Loan ID,Member,Amount (N),Interest %,Outstanding (N),Eligibility,Approval,Completion',
    ...loans.value.map(l =>
      [l.loanId, l.member, l.loanAmount, l.interestRate, l.outstandingBalance,
       l.eligibilityStatus, l.approvalStatus, l.completionStatus].join(',')
    ),
    '',
    '=== LOAN REPAYMENTS ===',
    'Repayment ID,Loan ID,Member,Amount Paid (N),Updated Balance (N),Date',
    ...repayments.value.map(r =>
      [r.repaymentId, r.loanId, r.memberName, r.amountPaid, r.updatedBalance, r.paymentDate].join(',')
    ),
    '',
    '=== ATTENDANCE ===',
    'Meeting,Date,Member,Status,Method',
    ...meetings.value.flatMap(mtg =>
      (mtg.records || []).map(rec => {
        const m = members.value.find(mb => mb.id === rec.memberId);
        return [mtg.title, mtg.date, m ? m.name : rec.memberId, rec.status, rec.method].join(',');
      })
    )
  ];
  dl('cooperative-full-report.csv', rows);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
