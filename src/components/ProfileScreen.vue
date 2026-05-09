<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">

    <!-- Header -->
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 sticky top-0 z-10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img :src="user.picture" referrerpolicy="no-referrer"
          class="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover" />
        <div>
          <p class="font-semibold text-sm text-slate-900 dark:text-white">{{ employee?.name || user.name }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {{ employee?.employeeId ? `ID: ${employee.employeeId}` : 'Loading...' }}
          </p>
        </div>
      </div>
      <button @click="showLogoutConfirm = true"
        class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-300 transition-all duration-200">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
      </button>
    </header>

    <!-- Content -->
    <div class="flex-1 px-4 py-5 max-w-lg mx-auto w-full pb-12">

      <!-- Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div class="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
        <div class="h-40 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
        <div class="h-40 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
      </div>

      <!-- Not Found -->
      <div v-else-if="!employee" class="text-center py-20 px-6">
        <div class="text-5xl mb-4">🔍</div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Not Registered</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Your email <span class="font-semibold text-slate-700 dark:text-slate-300">{{ user.email }}</span> was not found. Contact your admin.
        </p>
      </div>

      <template v-else>

        <!-- Profile Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">Profile</p>
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div class="flex justify-between items-center py-3">
              <span class="text-sm text-slate-500 dark:text-slate-400">Employee ID</span>
              <span class="text-sm font-semibold text-slate-800 dark:text-white font-mono">{{ employee.employeeId }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-sm text-slate-500 dark:text-slate-400">Full Name</span>
              <span class="text-sm font-semibold text-slate-800 dark:text-white">{{ employee.name }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-sm text-slate-500 dark:text-slate-400">Email</span>
              <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ employee.email }}</span>
            </div>
          </div>
        </div>

        <!-- Time In Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-4 border transition-all duration-300 shadow-sm"
          :class="employee.timeInAlready
            ? 'border-emerald-400 dark:border-emerald-600'
            : 'border-slate-200 dark:border-slate-800'">
          <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">Time In</p>

          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {{ employee.timeInTime || '-- : --' }}
              </p>
              <p class="text-xs text-slate-400 mt-1">{{ employee.timeInAlready ? 'Clocked in' : 'Not yet clocked in' }}</p>
            </div>

            <!-- Toggle -->
            <button @click="toggleTimeIn" :disabled="saving"
              class="relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              :class="employee.timeInAlready ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'">
              <span class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300"
                :class="employee.timeInAlready ? 'translate-x-8' : 'translate-x-0'">
              </span>
            </button>
          </div>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            :class="employee.timeInAlready
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
            <span class="w-1.5 h-1.5 rounded-full"
              :class="employee.timeInAlready ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'"></span>
            {{ employee.timeInAlready ? 'Clocked In' : 'Not Clocked In' }}
          </span>
        </div>

        <!-- Time Out Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-6 border transition-all duration-300 shadow-sm"
          :class="employee.timeOutAlready
            ? 'border-emerald-400 dark:border-emerald-600'
            : 'border-slate-200 dark:border-slate-800'">
          <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">Time Out</p>

          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {{ employee.timeOutTime || '-- : --' }}
              </p>
              <p class="text-xs text-slate-400 mt-1">{{ employee.timeOutAlready ? 'Clocked out' : 'Not yet clocked out' }}</p>
            </div>

            <!-- Toggle -->
            <button @click="toggleTimeOut" :disabled="saving"
              class="relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              :class="employee.timeOutAlready ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'">
              <span class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300"
                :class="employee.timeOutAlready ? 'translate-x-8' : 'translate-x-0'">
              </span>
            </button>
          </div>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            :class="employee.timeOutAlready
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
            <span class="w-1.5 h-1.5 rounded-full"
              :class="employee.timeOutAlready ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'"></span>
            {{ employee.timeOutAlready ? 'Clocked Out' : 'Not Clocked Out' }}
          </span>
        </div>

        <!-- Saving Indicator -->
        <div class="flex justify-center">
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-90"
            leave-active-class="transition-all duration-200"
            leave-to-class="opacity-0 scale-90">
            <div v-if="saving"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-medium text-slate-400">
              <span class="w-3.5 h-3.5 border-2 border-slate-200 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin"></span>
              Saving...
            </div>
          </Transition>
        </div>

        <!-- Toast -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-y-4"
          leave-active-class="transition-all duration-300"
          leave-to-class="opacity-0 translate-y-4">
          <div v-if="toast.show"
            class="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-xl z-50 whitespace-nowrap"
            :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'">
            {{ toast.message }}
          </div>
        </Transition>

      </template>
    </div>

    <!-- Logout Confirmation Modal -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-all duration-200"
      leave-to-class="opacity-0">
      <div v-if="showLogoutConfirm"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
        @click.self="showLogoutConfirm = false">
        <Transition
          enter-active-class="transition-all duration-250"
          enter-from-class="opacity-0 translate-y-6 scale-95"
          leave-active-class="transition-all duration-200"
          leave-to-class="opacity-0 translate-y-6 scale-95">
          <div v-if="showLogoutConfirm"
            class="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800">

            <!-- Icon -->
            <div class="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center mb-4 mx-auto">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </div>

            <!-- Text -->
            <h3 class="text-base font-bold text-slate-900 dark:text-white text-center mb-1">Leave the app?</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Are you sure you want to log out?</p>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button @click="showLogoutConfirm = false"
                class="flex-1 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200">
                No, stay
              </button>
              <button @click="$emit('logout')"
                class="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-200 dark:shadow-red-950">
                Yes, log out
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSheets } from '../composables/useSheets'

const props = defineProps(['user', 'token'])
defineEmits(['logout'])

const { getEmployeeByEmail, updateEmployee } = useSheets(ref(props.token))
const employee = ref(null)
const loading = ref(true)
const saving = ref(false)
const showLogoutConfirm = ref(false)
const toast = ref({ show: false, message: '', type: '' })

onMounted(async () => {
  try {
    employee.value = await getEmployeeByEmail(props.user.email)
  } catch (e) {
    showToast('Failed to load data. Check your config.', 'error')
  }
  loading.value = false
})

async function toggleTimeIn() {
  employee.value.timeInAlready = !employee.value.timeInAlready
  await saveChanges('timeInAlready')
}

async function toggleTimeOut() {
  employee.value.timeOutAlready = !employee.value.timeOutAlready
  await saveChanges('timeOutAlready')
}

async function saveChanges(field = null) {
  saving.value = true
  try {
    const ok = await updateEmployee(employee.value.rowIndex, employee.value)
    if (ok) {
      showToast('Attendance saved! ✓', 'success')
    } else {
      if (field) employee.value[field] = !employee.value[field] // revert toggle
      showToast('Save failed. Try again.', 'error')
    }
  } catch (e) {
    if (field) employee.value[field] = !employee.value[field] // revert toggle
    showToast('Error saving. Check connection.', 'error')
  }
  saving.value = false
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}
</script>