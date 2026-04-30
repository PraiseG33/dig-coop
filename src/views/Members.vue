<template>
  <Sidenav />
  <div class="mx-4 lg:mx-20 my-6 flex flex-col gap-8">

    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start gap-6">
      <div>
        <h1 class="text-[27px] font-medium">Members Management</h1>
        <p class="font-semibold text-gray-400">View, Add, Edit or remove cooperative members</p>
      </div>
      <button @click="openAddModal"
        class="bg-gradient-to-r from-green-600 to-green-800 py-2 px-5 rounded-[10px] text-white font-semibold">
        + Add New Member
      </button>
    </div>

    <!-- Search -->
    <div class="flex flex-col sm:flex-row justify-center gap-4 items-center bg-white shadow-md p-5 rounded-[40px]">
      <input v-model="searchQuery" type="search"
        placeholder="Search by name, phone, email or membership ID"
        class="w-full sm:w-[70%] border border-green-200 rounded-[20px] px-4 py-2 focus:outline-none focus:border-green-300" />
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-[20px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-green-100 border-b">
            <tr class="text-gray-600 text-sm">
              <th class="font-semibold text-left px-5 py-4">Membership ID</th>
              <th class="font-semibold text-left px-5 py-4">Name</th>
              <th class="font-semibold text-left px-5 py-4">Gender</th>
              <th class="font-semibold text-left px-5 py-4">Phone</th>
              <th class="font-semibold text-left px-5 py-4">Email</th>
              <th class="font-semibold text-right px-5 py-4">Contributions (₦)</th>
              <th class="font-semibold text-right px-5 py-4">Savings (₦)</th>
              <th class="font-semibold text-center px-5 py-4">Meetings</th>
              <th class="font-semibold text-center px-5 py-4">Attendance %</th>
              <th class="font-semibold text-center px-5 py-4">Badge</th>
              <th class="font-semibold text-center px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="11" class="text-center py-12 text-gray-500 text-lg">
                {{ searchQuery ? 'No members found matching your search.' : 'No members added yet.' }}
              </td>
            </tr>
            <tr v-for="member in filteredMembers" :key="member.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition text-sm">
              <td class="py-4 px-5 text-gray-500 font-mono">{{ member.membershipId }}</td>
              <td class="py-4 px-5 font-medium text-gray-800">{{ member.name }}</td>
              <td class="py-4 px-5 text-gray-600">{{ member.gender || '—' }}</td>
              <td class="py-4 px-5 text-gray-600">{{ member.phone }}</td>
              <td class="py-4 px-5 text-gray-600">{{ member.email || '—' }}</td>
              <td class="py-4 px-5 text-right font-medium text-gray-800">₦{{ fmt(member.totalContributions) }}</td>
              <td class="py-4 px-5 text-right font-medium text-gray-800">₦{{ fmt(member.savingsAmount) }}</td>
              <td class="py-4 px-5 text-center text-gray-800">{{ member.meetingsAttended }}</td>
              <td class="py-4 px-5 text-center font-medium text-gray-800">{{ attendancePct(member) }}%</td>
              <td class="py-4 px-5 text-center">
                <span class="inline-block px-3 py-1 rounded-[15px] text-xs font-semibold text-white"
                  :class="badgeClass(member.badge)">
                  {{ member.badge }}
                </span>
              </td>
              <td class="py-4 px-5">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(member)"
                    class="text-blue-600 py-1 px-3 rounded-[10px] font-medium border border-blue-600 hover:bg-blue-50 transition text-xs">
                    Edit
                  </button>
                  <button @click="openDeleteModal(member)"
                    class="text-red-600 py-1 px-3 rounded-[10px] font-medium border border-red-600 hover:bg-red-50 transition text-xs">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="closeAddEditModal">
      <div class="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit Member' : 'Add New Member' }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- Membership ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Membership ID</label>
            <input v-model="form.membershipId" placeholder="e.g. COOP-0001"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name <span class="text-red-500">*</span></label>
            <input v-model="form.name" placeholder="Full legal name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Gender -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select v-model="form.gender"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option value="">— Select —</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input v-model="form.dob" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone <span class="text-red-500">*</span></label>
            <input v-model="form.phone" placeholder="e.g. 08012345678"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" placeholder="optional"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input v-model="form.password" type="password" placeholder="Member login password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Savings Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Savings Amount (₦)</label>
            <input v-model.number="form.savingsAmount" type="number" min="0" placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Total Contributions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Total Contributions (₦)</label>
            <input v-model.number="form.totalContributions" type="number" min="0" placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Meetings Attended -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meetings Attended</label>
            <input v-model.number="form.meetingsAttended" type="number" min="0" placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
          </div>

          <!-- Badge -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <select v-model="form.badge"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option>New Member</option>
              <option>Member</option>
              <option>Bronze Member</option>
              <option>Silver Member</option>
              <option>Gold Member</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>VIP</option>
            </select>
          </div>
        </div>

        <div class="flex justify-center gap-4 mt-8">
          <button type="button" @click="closeAddEditModal"
            class="px-6 py-2 border border-gray-400 rounded-lg font-medium hover:bg-gray-100">Cancel</button>
          <button type="button" @click="saveMember"
            class="px-6 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white font-medium rounded-lg">
            {{ isEditing ? 'Update Member' : 'Add Member' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="closeDeleteModal">
      <div class="bg-white rounded-lg p-8 w-full max-w-sm mx-4 shadow-xl text-center">
        <h3 class="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-700 mb-8">
          Are you sure you want to delete <strong>{{ memberToDelete?.name }}</strong>?<br />
          This action cannot be undone.
        </p>
        <div class="flex justify-center gap-4">
          <button @click="closeDeleteModal"
            class="px-6 py-2 bg-white border border-green-600 font-semibold text-green-600 rounded-lg hover:bg-green-50">Cancel</button>
          <button @click="confirmDelete"
            class="px-6 py-2 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50">Delete</button>
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
const showAddEditModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentEditMember = ref(null);
const memberToDelete = ref(null);

const blankForm = () => ({
  membershipId: '',
  name: '',
  gender: '',
  dob: '',
  phone: '',
  email: '',
  password: '',
  savingsAmount: 0,
  totalContributions: 0,
  meetingsAttended: 0,
  badge: 'New Member'
});

const form = ref(blankForm());

// Auto-generate next membership ID
const nextMembershipId = () => {
  if (!members.value.length) return 'COOP-0001';
  const nums = members.value
    .map(m => parseInt((m.membershipId || '').replace(/\D/g, '')) || 0);
  return 'COOP-' + String(Math.max(...nums) + 1).padStart(4, '0');
};

const filteredMembers = computed(() => {
  if (!searchQuery.value.trim()) return members.value;
  const q = searchQuery.value.toLowerCase();
  return members.value.filter(m =>
    m.name.toLowerCase().includes(q) ||
    (m.phone || '').includes(q) ||
    (m.email || '').toLowerCase().includes(q) ||
    (m.membershipId || '').toLowerCase().includes(q)
  );
});

// Total meetings recorded (for attendance %)
const totalMeetings = computed(() => {
  const stored = JSON.parse(localStorage.getItem('cooperativeMeetings') || '[]');
  return stored.length || 1;
});

const attendancePct = (m) =>
  Math.round((Number(m.meetingsAttended || 0) / totalMeetings.value) * 100);

const fmt = (n) => Number(n || 0).toLocaleString();

const badgeClass = (badge) => ({
  'Gold Member': 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700',
  'Silver Member': 'bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600',
  'Bronze Member': 'bg-gradient-to-br from-orange-300 via-amber-600 to-orange-700',
  'VIP': 'bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800',
  'Active': 'bg-gradient-to-br from-green-400 via-green-600 to-green-800',
  'Inactive': 'bg-gradient-to-br from-red-300 via-red-500 to-red-700',
  'New Member': 'bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700',
}[badge] || 'bg-gradient-to-br from-green-400 via-green-600 to-green-800');

const openAddModal = () => {
  isEditing.value = false;
  form.value = { ...blankForm(), membershipId: nextMembershipId() };
  showAddEditModal.value = true;
};

const openEditModal = (member) => {
  isEditing.value = true;
  currentEditMember.value = member;
  form.value = { ...member };
  showAddEditModal.value = true;
};

const closeAddEditModal = () => { showAddEditModal.value = false; };

const saveMember = () => {
  if (!form.value.name.trim() || !form.value.phone.trim()) {
    alert('Name and Phone are required.');
    return;
  }
  if (isEditing.value) {
    Object.assign(currentEditMember.value, form.value);
  } else {
    members.value.push({ ...form.value, id: Date.now() });
  }
  closeAddEditModal();
};

const openDeleteModal = (member) => {
  memberToDelete.value = member;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  memberToDelete.value = null;
};

const confirmDelete = () => {
  if (memberToDelete.value)
    members.value = members.value.filter(m => m.id !== memberToDelete.value.id);
  closeDeleteModal();
};
</script>
