<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-in" data-aos-delay="20">
      <div>
        <h1 class="text-[27px] font-medium">Financial Summary</h1>
        <p class="font-semibold text-gray-400">Overview of contributions, loans, repayments, attendance, and dividends.</p>
      </div>
      <button @click="printReport"
        class="border border-green-600 text-green-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition">
        Print Report
      </button>
    </div>

    <!-- Date Range Filter (Appendix A7) -->
    <div class="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-4 items-center flex-wrap">
      <span class="text-sm font-medium text-gray-600 whitespace-nowrap">Report Period:</span>
      <div class="flex items-center gap-2">
        <label class="text-xs text-gray-500">From</label>
        <input v-model="dateFrom" type="date"
          class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400" />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs text-gray-500">To</label>
        <input v-model="dateTo" type="date"
          class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400" />
      </div>
      <button @click="clearFilter"
        class="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50">
        Clear Filter
      </button>
      <span class="text-xs text-gray-400 ml-auto">Generated: {{ now }}</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Contributions</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ fmt(totalContributions) }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Loans Issued</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ fmt(totalLoansIssued) }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Outstanding Balance</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ fmt(outstandingBalance) }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Avg. Attendance Rate</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ avgAttendance }}%</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 1: Contributions -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <h2 class="font-semibold text-gray-800">Contributions Report</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-600">
              <th class="text-left px-6 py-3">Membership ID</th>
              <th class="text-left px-6 py-3">Member</th>
              <th class="text-right px-6 py-3">Total Contributions (₦)</th>
              <th class="text-right px-6 py-3">Savings (₦)</th>
              <th class="text-center px-6 py-3">Meetings</th>
              <th class="text-center px-6 py-3">Attendance %</th>
              <th class="text-center px-6 py-3">Badge</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in members" :key="m.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-3 font-mono text-gray-400 text-xs">{{ m.membershipId || '—' }}</td>
              <td class="px-6 py-3 font-medium text-gray-800">{{ m.name }}</td>
              <td class="px-6 py-3 text-right">₦{{ fmt(m.totalContributions) }}</td>
              <td class="px-6 py-3 text-right">₦{{ fmt(m.savingsAmount) }}</td>
              <td class="px-6 py-3 text-center">{{ m.meetingsAttended }} / {{ totalMeetings }}</td>
              <td class="px-6 py-3 text-center">
                <span :class="attendPct(m) >= 70 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'">
                  {{ attendPct(m) }}%
                </span>
              </td>
              <td class="px-6 py-3 text-center">
                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{{ m.badge || 'New Member' }}</span>
              </td>
            </tr>
            <tr v-if="!members.length">
              <td colspan="7" class="text-center py-10 text-gray-400">No members yet.</td>
            </tr>
          </tbody>
          <tfoot v-if="members.length" class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="2" class="px-6 py-3 font-semibold text-gray-700">Total</td>
              <td class="px-6 py-3 text-right font-bold text-green-700">₦{{ fmt(totalContributions) }}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Section 2: Loans -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <h2 class="font-semibold text-gray-800">Loans & Repayments Report</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-600">
              <th class="text-left px-6 py-3">Loan ID</th>
              <th class="text-left px-6 py-3">Member</th>
              <th class="text-right px-6 py-3">Amount (₦)</th>
              <th class="text-center px-6 py-3">Interest %</th>
              <th class="text-right px-6 py-3">Outstanding (₦)</th>
              <th class="text-left px-6 py-3">Purpose</th>
              <th class="text-center px-6 py-3">Eligibility</th>
              <th class="text-center px-6 py-3">Approval</th>
              <th class="text-center px-6 py-3">Completion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in filteredLoans" :key="l.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-3 font-mono text-gray-400 text-xs">{{ l.loanId }}</td>
              <td class="px-6 py-3 font-medium text-gray-800">{{ l.member }}</td>
              <td class="px-6 py-3 text-right">₦{{ fmt(l.loanAmount) }}</td>
              <td class="px-6 py-3 text-center">{{ l.interestRate }}%</td>
              <td class="px-6 py-3 text-right" :class="l.outstandingBalance > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'">
                ₦{{ fmt(l.outstandingBalance) }}
              </td>
              <td class="px-6 py-3 text-gray-500">{{ l.purpose || '—' }}</td>
              <td class="px-6 py-3 text-center">
                <span class="text-xs px-2 py-0.5 rounded-full"
                  :class="l.eligibilityStatus === 'Eligible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                  {{ l.eligibilityStatus || '—' }}
                </span>
              </td>
              <td class="px-6 py-3 text-center">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="approvalClass(l.approvalStatus)">
                  {{ l.approvalStatus }}
                </span>
              </td>
              <td class="px-6 py-3 text-center">
                <span class="text-xs px-2 py-0.5 rounded-full"
                  :class="l.completionStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                  {{ l.completionStatus }}
                </span>
              </td>
            </tr>
            <tr v-if="!filteredLoans.length">
              <td colspan="9" class="text-center py-10 text-gray-400">No loan records.</td>
            </tr>
          </tbody>
          <tfoot v-if="filteredLoans.length" class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="2" class="px-6 py-3 font-semibold text-gray-700">Total</td>
              <td class="px-6 py-3 text-right font-bold text-blue-700">₦{{ fmt(totalLoansIssued) }}</td>
              <td></td>
              <td class="px-6 py-3 text-right font-bold text-red-600">₦{{ fmt(outstandingBalance) }}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Section 3: Repayments -->
    <div v-if="repayments.length" class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-teal-500"></div>
        <h2 class="font-semibold text-gray-800">Loan Repayments Report</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-600">
              <th class="text-left px-6 py-3">Repayment ID</th>
              <th class="text-left px-6 py-3">Loan ID</th>
              <th class="text-left px-6 py-3">Member</th>
              <th class="text-right px-6 py-3">Amount Paid (₦)</th>
              <th class="text-right px-6 py-3">Updated Balance (₦)</th>
              <th class="text-center px-6 py-3">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in repayments" :key="r.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-3 font-mono text-gray-400 text-xs">{{ r.repaymentId }}</td>
              <td class="px-6 py-3 font-mono text-gray-400 text-xs">{{ r.loanId }}</td>
              <td class="px-6 py-3 font-medium text-gray-800">{{ r.memberName }}</td>
              <td class="px-6 py-3 text-right text-green-600 font-semibold">₦{{ fmt(r.amountPaid) }}</td>
              <td class="px-6 py-3 text-right" :class="r.updatedBalance > 0 ? 'text-red-500' : 'text-gray-400'">
                ₦{{ fmt(r.updatedBalance) }}
              </td>
              <td class="px-6 py-3 text-center text-gray-500">{{ r.paymentDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 4: Attendance -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
        <h2 class="font-semibold text-gray-800">Attendance Report</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr class="text-gray-600">
              <th class="text-left px-6 py-3">Meeting</th>
              <th class="text-center px-6 py-3">Date</th>
              <th class="text-center px-6 py-3">Present</th>
              <th class="text-center px-6 py-3">Absent</th>
              <th class="text-center px-6 py-3">Excused</th>
              <th class="text-center px-6 py-3">Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mtg in filteredMeetings" :key="mtg.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-3 font-medium text-gray-800">{{ mtg.title }}</td>
              <td class="px-6 py-3 text-center text-gray-600">{{ fmtDate(mtg.date) }}</td>
              <td class="px-6 py-3 text-center text-green-600 font-semibold">{{ countStatus(mtg, 'Present') }}</td>
              <td class="px-6 py-3 text-center text-red-500 font-semibold">{{ countStatus(mtg, 'Absent') }}</td>
              <td class="px-6 py-3 text-center text-yellow-600 font-semibold">{{ countStatus(mtg, 'Excused') }}</td>
              <td class="px-6 py-3 text-center">
                <span :class="meetingRate(mtg) >= 70 ? 'text-green-600 font-semibold' : 'text-orange-500 font-semibold'">
                  {{ meetingRate(mtg) }}%
                </span>
              </td>
            </tr>
            <tr v-if="!filteredMeetings.length">
              <td colspan="6" class="text-center py-10 text-gray-400">No meeting records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 5: Dividend Distribution -->
<div class="bg-white rounded-xl shadow-md overflow-hidden">
  <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
    <h2 class="font-semibold text-gray-800">Dividend Distribution Report</h2>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-100 border-b">
        <tr class="text-gray-600">
          <th class="text-left px-6 py-3">Member</th>
          <th class="text-left px-6 py-3">Period</th>
          <th class="text-right px-6 py-3">Total Contribution (₦)</th>
          <th class="text-center px-6 py-3">Attendance Score</th>
          <th class="text-right px-6 py-3">Dividend Amount (₦)</th>
          <th class="text-center px-6 py-3">Distribution Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="d in dividends"
          :key="d.id"
          class="border-t border-gray-100 hover:bg-gray-50"
        >
          <td class="px-6 py-3 font-medium text-gray-800">{{ d.memberName }}</td>
          <td class="px-6 py-3 text-gray-500">{{ d.period }}</td>
          <td class="px-6 py-3 text-right">₦{{ fmt(d.totalContribution) }}</td>
          <td class="px-6 py-3 text-center">{{ d.attendanceScore }}%</td>
          <td class="px-6 py-3 text-right font-semibold text-yellow-700">
            ₦{{ fmt(d.dividendAmount) }}
          </td>
          <td class="px-6 py-3 text-center">
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="d.distributionStatus === 'Distributed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'"
            >
              {{ d.distributionStatus || 'Pending' }}
            </span>
          </td>
        </tr>
        <tr v-if="!dividends.length">
          <td colspan="6" class="text-center py-10 text-gray-400">
            No dividend records found.
          </td>
        </tr>
      </tbody>
      <tfoot v-if="dividends.length" class="bg-gray-50 border-t-2 border-gray-200">
        <tr>
          <td colspan="4" class="px-6 py-3 font-semibold text-gray-700">Total Dividends</td>
          <td class="px-6 py-3 text-right font-bold text-yellow-700">
            ₦{{ fmt(totalDividends) }}
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidenav from '@/components/Sidenav.vue';
import { useMembers } from '@/composables/useMembers';

const { members } = useMembers();
const meetings = ref(JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'));
const loans = ref(JSON.parse(localStorage.getItem('cooperativeLoans') || '[]'));
const repayments = ref(JSON.parse(localStorage.getItem('cooperativeLoanRepayments') || '[]'));
const dividends = ref(JSON.parse(localStorage.getItem('cooperativeDividends') || '[]'))
const totalDividends = computed(() =>
  dividends.value.reduce((s, d) => s + Number(d.dividendAmount || 0), 0)
)

const now = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

// Date range filter
const dateFrom = ref('');
const dateTo = ref('');
const clearFilter = () => { dateFrom.value = ''; dateTo.value = ''; };

const inRange = (dateStr) => {
  if (!dateStr) return true;
  if (!dateFrom.value && !dateTo.value) return true;
  const d = new Date(dateStr + 'T00:00:00');
  if (dateFrom.value && d < new Date(dateFrom.value)) return false;
  if (dateTo.value && d > new Date(dateTo.value)) return false;
  return true;
};

const filteredLoans = computed(() => loans.value.filter(l => inRange(l.applicationDate)));
const filteredMeetings = computed(() => meetings.value.filter(m => inRange(m.date)));

const totalContributions = computed(() =>
  members.value.reduce((s, m) => s + Number(m.totalContributions || 0), 0)
);
const totalLoansIssued = computed(() =>
  filteredLoans.value.reduce((s, l) => s + Number(l.loanAmount || 0), 0)
);
const outstandingBalance = computed(() =>
  filteredLoans.value.reduce((s, l) => s + Number(l.outstandingBalance || 0), 0)
);
const totalMeetings = computed(() => meetings.value.length || 1);

const avgAttendance = computed(() => {
  if (!filteredMeetings.value.length || !members.value.length) return 0;
  const rates = filteredMeetings.value.map(m => meetingRate(m));
  return Math.round(rates.reduce((s, r) => s + r, 0) / rates.length);
});

const attendPct = (m) =>
  Math.min(100, Math.round((Number(m.meetingsAttended || 0) / totalMeetings.value) * 100));

const countStatus = (mtg, status) =>
  (mtg.records || []).filter(r => r.status === status).length;

const meetingRate = (mtg) => {
  if (!members.value.length) return 0;
  return Math.round((countStatus(mtg, 'Present') / members.value.length) * 100);
};

const fmt = n => Number(n || 0).toLocaleString();
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const approvalClass = s => ({
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
}[s] || 'bg-gray-100 text-gray-600');

const printReport = () => window.print();
</script>
