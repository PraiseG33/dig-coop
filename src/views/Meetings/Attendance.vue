<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-in" data-aos-delay="20">
      <div>
        <h1 class="text-[27px] font-medium">Attendance</h1>
        <p class="font-semibold text-gray-400">Record and monitor member attendance at cooperative meetings.</p>
      </div>
      <button
        @click="openNewMeetingModal"
        class="bg-linear-to-r from-green-600 to-green-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:to-green-900 transition shadow"
      >
        + New Meeting Session
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Total Meetings</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">{{ meetings.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Total Members</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">{{ members.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Avg. Attendance Rate</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">{{ overallAvgRate }}%</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
        <p class="text-sm text-gray-500">Last Meeting</p>
        <p class="text-xl font-semibold text-gray-800 mt-1">{{ lastMeetingDate || '—' }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="meetings.length === 0" class="bg-white rounded-xl shadow-md p-16 text-center text-gray-400 text-lg">
      No meeting sessions recorded yet. Click <strong>+ New Meeting Session</strong> to get started.
    </div>

    <!-- Meetings List -->
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="meeting in sortedMeetings"
        :key="meeting.id"
        class="bg-white rounded-xl shadow-md p-6"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">{{ meeting.title }}</h2>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ formatDate(meeting.date) }} &mdash;
              <span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{{ meeting.qrCode }}</span>
            </p>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-sm text-gray-600 font-medium">
              {{ presentCount(meeting) }}/{{ members.length }} present
              <span class="ml-1 text-green-600 font-semibold">({{ attendanceRate(meeting) }}%)</span>
            </span>
            <button
              @click="openAttendanceModal(meeting)"
              class="text-sm border border-blue-600 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Mark Attendance
            </button>
            <button
              @click="openQRModal(meeting)"
              class="text-sm border border-green-600 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition font-medium"
            >
              Show QR Code
            </button>
            <button
              @click="deleteMeeting(meeting.id)"
              class="text-sm border border-red-400 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            class="bg-green-500 h-2 rounded-full transition-all"
            :style="{ width: attendanceRate(meeting) + '%' }"
          ></div>
        </div>

        <!-- Per-member table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-4 py-2 font-semibold text-gray-600">Member</th>
                <th class="text-center px-4 py-2 font-semibold text-gray-600">Status</th>
                <th class="text-center px-4 py-2 font-semibold text-gray-600">Check-in Method</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in members"
                :key="member.id"
                class="border-t border-gray-100"
              >
                <td class="px-4 py-2 text-gray-800 font-medium">{{ member.name }}</td>
                <td class="px-4 py-2 text-center">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="statusClass(getStatus(meeting, member.id))"
                  >
                    {{ getStatus(meeting, member.id) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-center text-gray-500 text-xs">
                  {{ getMethod(meeting, member.id) }}
                </td>
              </tr>
              <tr v-if="members.length === 0">
                <td colspan="3" class="text-center py-6 text-gray-400">No members registered yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- New Meeting Modal -->
    <div
      v-if="showNewMeetingModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showNewMeetingModal = false"
    >
      <div class="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-xl">
        <h3 class="text-xl font-bold mb-6">New Meeting Session</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
            <input
              v-model="newMeeting.title"
              placeholder="e.g. Monthly General Meeting – April"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              v-model="newMeeting.date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Session ID (auto-generated)</label>
            <input
              :value="newMeeting.qrCode"
              readonly
              class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-mono text-sm"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showNewMeetingModal = false" class="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button @click="createMeeting" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:to-green-900">Create Session</button>
        </div>
      </div>
    </div>

    <!-- Mark Attendance Modal -->
    <div
      v-if="showAttendanceModal && selectedMeeting"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showAttendanceModal = false"
    >
      <div class="bg-white rounded-xl p-8 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-1">Mark Attendance</h3>
        <p class="text-gray-500 text-sm mb-6">{{ selectedMeeting.title }} &mdash; {{ formatDate(selectedMeeting.date) }}</p>

        <div class="flex gap-2 mb-4">
          <button @click="markAll('Present')" class="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200">Mark All Present</button>
          <button @click="markAll('Absent')" class="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200">Mark All Absent</button>
        </div>

        <div class="space-y-3">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <span class="font-medium text-gray-800">{{ member.name }}</span>
            <div class="flex items-center gap-2">
              <select
                v-model="attendanceEdits[member.id].status"
                class="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-green-400"
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Excused</option>
              </select>
              <select
                v-model="attendanceEdits[member.id].method"
                class="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-green-400"
              >
                <option>Manual</option>
                <option>QR Code</option>
              </select>
            </div>
          </div>
          <p v-if="members.length === 0" class="text-center text-gray-400 py-6">No members to mark — add members first.</p>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button @click="showAttendanceModal = false" class="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button @click="saveAttendance" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:to-green-900">Save Attendance</button>
        </div>
      </div>
    </div>

    <!-- QR Code Modal -->
<div
  v-if="showQRModal && qrMeeting"
  class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  @click.self="showQRModal = false"
>
  <div class="bg-white rounded-xl p-8 w-full max-w-sm mx-4 shadow-xl text-center">
    <h3 class="text-xl font-bold mb-1">Meeting QR Code</h3>
    <p class="text-gray-500 text-sm mb-6">
      {{ qrMeeting.title }} — {{ formatDate(qrMeeting.date) }}
    </p>
    <img :src="qrImageUrl" alt="QR Code" class="w-64 h-64 mx-auto rounded-lg" />
    <p class="text-xs text-gray-400 mt-4">
      Members scan this code to check in automatically
    </p>
    <button
      @click="showQRModal = false"
      class="mt-6 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
    >
      Close
    </button>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Sidenav from '@/components/Sidenav.vue';
import { useMembers } from '@/composables/useMembers';
import QRCode from 'qrcode'

const { members } = useMembers();

const meetings = ref(JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]'));

watch(meetings, val => {
  localStorage.setItem('cooperativeMeetings', JSON.stringify(val));
}, { deep: true });

const sortedMeetings = computed(() =>
  [...meetings.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);

const lastMeetingDate = computed(() => {
  if (!meetings.value.length) return null;
  const sorted = [...meetings.value].sort((a, b) => new Date(b.date) - new Date(a.date));
  return formatDate(sorted[0].date);
});

const overallAvgRate = computed(() => {
  if (!meetings.value.length || !members.value.length) return 0;
  const rates = meetings.value.map(m => attendanceRate(m));
  return Math.round(rates.reduce((s, r) => s + r, 0) / rates.length);
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const generateQR = () => 'MTG-' + Math.random().toString(36).substring(2, 8).toUpperCase();

const getRecord = (meeting, memberId) =>
  (meeting.records || []).find(r => r.memberId === memberId);

const getStatus = (meeting, memberId) =>
  getRecord(meeting, memberId)?.status || 'Absent';

const getMethod = (meeting, memberId) =>
  getRecord(meeting, memberId)?.method || '—';

const presentCount = (meeting) =>
  (meeting.records || []).filter(r => r.status === 'Present').length;

const attendanceRate = (meeting) => {
  if (!members.value.length) return 0;
  return Math.round((presentCount(meeting) / members.value.length) * 100);
};

const statusClass = (status) => ({
  Present: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Excused: 'bg-yellow-100 text-yellow-700',
}[status] || 'bg-gray-100 text-gray-500');

// New Meeting
const showNewMeetingModal = ref(false);
const newMeeting = ref({ title: '', date: '', qrCode: '' });

const openNewMeetingModal = () => {
  newMeeting.value = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    qrCode: generateQR()
  };
  showNewMeetingModal.value = true;
};

const createMeeting = () => {
  if (!newMeeting.value.title.trim() || !newMeeting.value.date) {
    alert('Please fill in the meeting title and date.');
    return;
  }
  meetings.value.push({
    id: Date.now(),
    title: newMeeting.value.title.trim(),
    date: newMeeting.value.date,
    qrCode: newMeeting.value.qrCode,
    records: members.value.map(m => ({ memberId: m.id, status: 'Absent', method: 'Manual' }))
  });
  showNewMeetingModal.value = false;
  syncMemberAttendance();
};

const deleteMeeting = (id) => {
  if (!confirm('Delete this meeting session?')) return;
  meetings.value = meetings.value.filter(m => m.id !== id);
  syncMemberAttendance();
};

// Mark Attendance
const showAttendanceModal = ref(false);
const selectedMeeting = ref(null);
const attendanceEdits = ref({});
const showQRModal = ref(false)
const qrImageUrl = ref('')
const qrMeeting = ref(null)

const openQRModal = async (meeting) => {
  qrMeeting.value = meeting
  const checkInUrl = `${window.location.origin}/checkin?meetingId=${meeting.id}&date=${meeting.date}&meetingTitle=${encodeURIComponent(meeting.title)}`
  qrImageUrl.value = await QRCode.toDataURL(checkInUrl, { width: 300 })
  showQRModal.value = true
};

const openAttendanceModal = (meeting) => {
  selectedMeeting.value = meeting;
  attendanceEdits.value = {};
  members.value.forEach(m => {
    const existing = getRecord(meeting, m.id);
    attendanceEdits.value[m.id] = {
      status: existing?.status || 'Absent',
      method: existing?.method || 'Manual'
    };
  });
  showAttendanceModal.value = true;
};

const markAll = (status) => {
  members.value.forEach(m => {
    attendanceEdits.value[m.id].status = status;
  });
};

const saveAttendance = () => {
  const mtg = meetings.value.find(m => m.id === selectedMeeting.value.id);
  if (!mtg) return;
  mtg.records = members.value.map(m => ({
    memberId: m.id,
    status: attendanceEdits.value[m.id].status,
    method: attendanceEdits.value[m.id].method
  }));
  showAttendanceModal.value = false;
  syncMemberAttendance();
};

// Sync meetingsAttended back onto each member for dashboard + dividends
const syncMemberAttendance = () => {
  members.value.forEach(m => {
    m.meetingsAttended = meetings.value.filter(mtg =>
      (mtg.records || []).some(r => r.memberId === m.id && r.status === 'Present')
    ).length;
  });
};
</script>
