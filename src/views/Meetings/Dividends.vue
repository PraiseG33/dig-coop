<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-in" data-aos-delay="20">
      <div>
        <h1 class="text-[27px] font-medium">Dividends</h1>
        <p class="text-gray-600 mt-1">Attendance-weighted dividend computation for all cooperative members.</p>
      </div>
      <div class="flex gap-3">
        <button @click="computeDividends"
          class="bg-linear-to-r from-green-600 to-green-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:to-green-900 transition shadow">
          Compute Dividends
        </button>
        <button @click="exportDividends"
          class="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition">
          Export CSV
        </button>
      </div>
    </div>

    <!-- Formula Banner -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
      <p class="font-semibold mb-1">Dividend Formula</p>
      <p class="font-mono text-xs bg-blue-100 px-2 py-1 rounded inline-block">
        Dividend = Pool × [ (ContribWeight × MemberContrib / TotalContrib) + (AttendWeight × MemberAttend / TotalMeetings) ]
      </p>
      <div class="mt-3 flex flex-wrap gap-5 text-xs">
        <label class="flex items-center gap-2">
          Contribution Weight:
          <input v-model.number="contribWeight" type="number" min="0" max="1" step="0.05"
            class="w-16 border border-blue-300 rounded px-2 py-0.5 focus:outline-none" />
        </label>
        <label class="flex items-center gap-2">
          Attendance Weight:
          <input v-model.number="attendWeight" type="number" min="0" max="1" step="0.05"
            class="w-16 border border-blue-300 rounded px-2 py-0.5 focus:outline-none" />
        </label>
        <label class="flex items-center gap-2">
          Dividend Pool (₦):
          <input v-model.number="dividendPool" type="number" min="0" step="1000"
            class="w-28 border border-blue-300 rounded px-2 py-0.5 focus:outline-none" />
        </label>
      </div>
      <p v-if="weightError" class="text-red-600 font-semibold mt-2">
        ⚠ Weights must sum to 1.0 (currently {{ (contribWeight + attendWeight).toFixed(2) }})
      </p>
    </div>

    <!-- Computation Period -->
    <div class="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-4 items-center">
      <span class="text-sm font-medium text-gray-600 whitespace-nowrap">Computation Period:</span>
      <input v-model="periodLabel" placeholder="e.g. Q1 2026 / January 2026"
        class="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400" />
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Dividend Pool</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ fmt(dividendPool) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Total Distributed</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ fmt(totalDistributed) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Total Members</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">{{ members.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Avg. Dividend</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">₦{{ fmt(avgDividend) }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="dividendRecords.length === 0" class="bg-white rounded-xl shadow-md p-16 text-center text-gray-400 text-lg">
      Click <strong>Compute Dividends</strong> to calculate entitlements for all members.
    </div>

    <!-- Results Table -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 class="font-semibold text-gray-800">Dividend Distribution — {{ periodLabel || 'Current Period' }}</h2>
        <div class="flex items-center gap-3 text-sm">
          <span class="text-gray-500">Computed: {{ computedAt }}</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
            :class="distributionStatus === 'Distributed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
            {{ distributionStatus }}
          </span>
          <button v-if="distributionStatus !== 'Distributed'" @click="markDistributed"
            class="text-xs border border-green-500 text-green-600 px-3 py-1 rounded-lg hover:bg-green-50">
            Mark as Distributed
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-green-50 border-b">
            <tr class="text-gray-600">
              <th class="text-left px-5 py-3 font-semibold">Dividend ID</th>
              <th class="text-center px-5 py-3 font-semibold">Rank</th>
              <th class="text-left px-5 py-3 font-semibold">Member</th>
              <th class="text-right px-5 py-3 font-semibold">Contributions (₦)</th>
              <th class="text-center px-5 py-3 font-semibold">Meetings Attended</th>
              <th class="text-center px-5 py-3 font-semibold">Attendance Score</th>
              <th class="text-right px-5 py-3 font-semibold">Dividend (₦)</th>
              <th class="text-center px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in dividendRecords" :key="row.dividendId"
              class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-4 font-mono text-gray-400 text-xs">{{ row.dividendId }}</td>
              <td class="px-5 py-4 text-center text-gray-500 font-medium">{{ idx + 1 }}</td>
              <td class="px-5 py-4 font-medium text-gray-800">{{ row.memberName }}</td>
              <td class="px-5 py-4 text-right">₦{{ fmt(row.totalContributionAmount) }}</td>
              <td class="px-5 py-4 text-center">{{ row.meetingsAttended }} / {{ totalMeetings }}</td>
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-16 bg-gray-100 rounded-full h-1.5">
                    <div class="bg-green-500 h-1.5 rounded-full" :style="{ width: row.attendanceScore + '%' }"></div>
                  </div>
                  <span>{{ row.attendanceScore }}%</span>
                </div>
              </td>
              <td class="px-5 py-4 text-right font-semibold text-green-700">₦{{ fmt(row.weightedDividendAmount) }}</td>
              <td class="px-5 py-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="row.distributionStatus === 'Distributed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  {{ row.distributionStatus }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="6" class="px-5 py-3 font-semibold text-gray-700 text-right">Total Distributed:</td>
              <td class="px-5 py-3 font-bold text-green-700 text-right">₦{{ fmt(totalDistributed) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Past Computations -->
    <div v-if="allComputations.length > 1" class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="font-semibold text-gray-800">Past Dividend Computations</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr class="text-gray-600">
              <th class="px-5 py-3 text-left font-semibold">Period</th>
              <th class="px-5 py-3 text-center font-semibold">Computed</th>
              <th class="px-5 py-3 text-right font-semibold">Pool (₦)</th>
              <th class="px-5 py-3 text-right font-semibold">Distributed (₦)</th>
              <th class="px-5 py-3 text-center font-semibold">Status</th>
              <th class="px-5 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comp in allComputations" :key="comp.computationDate + comp.period"
              class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-5 py-3 font-medium">{{ comp.period }}</td>
              <td class="px-5 py-3 text-center text-gray-500 text-xs">{{ comp.computationDate }}</td>
              <td class="px-5 py-3 text-right">₦{{ fmt(comp.pool) }}</td>
              <td class="px-5 py-3 text-right font-semibold text-green-700">₦{{ fmt(comp.totalDistributed) }}</td>
              <td class="px-5 py-3 text-center">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="comp.distributionStatus === 'Distributed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  {{ comp.distributionStatus }}
                </span>
              </td>
              <td class="px-5 py-3 text-center">
                <button @click="loadComputation(comp)"
                  class="text-xs border border-blue-500 text-blue-600 px-2 py-1 rounded hover:bg-blue-50">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Sidenav from '@/components/Sidenav.vue';
import { useMembers } from '@/composables/useMembers';

const { members } = useMembers();
const meetings = ref(JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'));
const totalMeetings = computed(() => meetings.value.length || 1);

// Config
const contribWeight = ref(0.6);
const attendWeight = ref(0.4);
const dividendPool = ref(500000);
const periodLabel = ref('');
const weightError = computed(() => Math.abs((contribWeight.value + attendWeight.value) - 1) > 0.001);

// All saved computations
const allComputations = ref(JSON.parse(localStorage.getItem('cooperativeDividendComputations') || '[]'));
watch(allComputations, val => localStorage.setItem('cooperativeDividendComputations', JSON.stringify(val)), { deep: true });

// Current view
const dividendRecords = ref([]);
const computedAt = ref('');
const distributionStatus = ref('Pending');

const totalContributions = computed(() =>
  members.value.reduce((s, m) => s + Number(m.totalContributions || 0), 0) || 1
);

const totalDistributed = computed(() =>
  dividendRecords.value.reduce((s, r) => s + r.weightedDividendAmount, 0)
);
const avgDividend = computed(() =>
  dividendRecords.value.length ? Math.round(totalDistributed.value / dividendRecords.value.length) : 0
);

const fmt = n => Number(n || 0).toLocaleString();

let divSeq = allComputations.value.reduce((max, c) =>
  Math.max(max, ...c.records.map(r => parseInt((r.dividendId || '').replace(/\D/g, '')) || 0)), 0);

const nextDivId = () => 'DIV-' + String(++divSeq).padStart(5, '0');

const computeDividends = () => {
  if (weightError.value) { alert('Weights must sum to 1.0'); return; }
  if (!members.value.length) { alert('No members to compute.'); return; }

  const now = new Date().toLocaleString('en-NG');
  const records = members.value.map(m => {
    const contrib = Number(m.totalContributions || 0);
    const attended = Number(m.meetingsAttended || 0);
    const attendScore = Math.round((attended / totalMeetings.value) * 100);
    const dividend = Math.round(
      dividendPool.value * (
        contribWeight.value * (contrib / totalContributions.value) +
        attendWeight.value * (attended / totalMeetings.value)
      )
    );
    return {
      dividendId: nextDivId(),
      memberId: m.id,
      memberName: m.name,
      computationPeriod: periodLabel.value || 'Unspecified',
      totalContributionAmount: contrib,
      meetingsAttended: attended,
      attendanceScore: attendScore,
      weightedDividendAmount: dividend,
      distributionStatus: 'Pending',
      computationDate: now
    };
  }).sort((a, b) => b.weightedDividendAmount - a.weightedDividendAmount);

  dividendRecords.value = records;
  computedAt.value = now;
  distributionStatus.value = 'Pending';

  // Save this computation
  allComputations.value.unshift({
    period: periodLabel.value || 'Unspecified',
    computationDate: now,
    pool: dividendPool.value,
    totalDistributed: records.reduce((s, r) => s + r.weightedDividendAmount, 0),
    distributionStatus: 'Pending',
    records
  });
};

const markDistributed = () => {
  distributionStatus.value = 'Distributed';
  dividendRecords.value.forEach(r => { r.distributionStatus = 'Distributed'; });
  if (allComputations.value.length) {
    allComputations.value[0].distributionStatus = 'Distributed';
    allComputations.value[0].records = dividendRecords.value;
  }
};

const loadComputation = (comp) => {
  dividendRecords.value = comp.records;
  computedAt.value = comp.computationDate;
  distributionStatus.value = comp.distributionStatus;
  periodLabel.value = comp.period;
  dividendPool.value = comp.pool;
};

const exportDividends = () => {
  if (!dividendRecords.value.length) { alert('Compute dividends first.'); return; }
  const rows = [
    `Dividend Distribution - ${periodLabel.value || 'Current Period'}`,
    `Computed At: ${computedAt.value}`,
    `Status: ${distributionStatus.value}`,
    '',
    'Dividend ID,Member,Contributions (N),Meetings Attended,Attendance Score,Dividend (N),Status',
    ...dividendRecords.value.map(r =>
      [r.dividendId, r.memberName, r.totalContributionAmount, r.meetingsAttended,
       r.attendanceScore + '%', r.weightedDividendAmount, r.distributionStatus].join(',')
    ),
    '',
    `Total Distributed,,,,,${totalDistributed.value}`
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dividends.csv';
  a.click();
};
</script>
