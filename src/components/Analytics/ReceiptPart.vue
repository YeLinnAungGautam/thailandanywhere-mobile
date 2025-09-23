<template>
  <div class="px-4 space-y-4">
    <div class="bg-main rounded-3xl pt-3 pb-4 pr-3 pl-6 space-y-6">
      <div class="flex flex-col">
        <p class="text-white text-xs">Receivables</p>

        <div class="flex w-full text-xs justify-start pt-3 items-center gap-4">
          <!-- Month Selector -->
          <select
            v-model="selectedMonth"
            @change="onMonthChange"
            class="bg-white text-black text-sm px-3 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Month</option>
            <option
              v-for="month in monthOptions"
              :key="month.value"
              :value="month.value"
            >
              {{ month.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Summary Cards Section -->
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold">
          {{ formattedNumber(dataCount) }}
        </p>
        <p class="text-white text-xl font-semibold">Total Receivables</p>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold">
          -{{ formattedNumber(dataSummary) }}
        </p>
        <p class="text-white text-xl font-semibold">THB Balance Due</p>
      </div>
    </div>

    <!-- Receivables List Section -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="mb-4">
        <p class="text-sm text-gray-500">
          Total Receivables:
          <span class="text-black font-semibold">{{
            formattedNumber(dataCount)
          }}</span>
          | Total Balance Due:
          <span class="text-red-600 font-semibold">{{
            formattedNumber(dataSummary)
          }}</span>
        </p>
      </div>

      <div v-if="loading" class="text-center text-gray-500">Loading...</div>

      <div
        v-if="!loading && receivables?.length > 0"
        class="h-[calc(100vh-270px)] overflow-y-auto"
      >
        <div
          v-for="r in receivables ?? []"
          :key="r.id"
          class="mb-4 p-4 bg-white border border-gray rounded-lg shadow text-sm"
        >
          <p class="pb-1 text-end font-medium">
            {{ r.payment_status.toUpperCase().replace("_", " ") }}
          </p>
          <div class="flex justify-between items-end gap-x-4">
            <div class="space-y-1 relative">
              <p>{{ getFormatDate(r.booking_date) }}</p>
              <p
                class="absolute top-4 left-0 w-2 h-2 bg-[#FF613c] rounded-full"
                v-if="r.include_vantour"
              ></p>
              <p
                class="absolute top-4 left-3 w-2 h-2 bg-[#2b06ff] rounded-full"
                v-if="r.include_flight"
              ></p>
              <p
                @click="goToBooking(r.id)"
                class="font-semibold text-base px-2 rounded-md bg-gray text-center inline-block cursor-pointer"
              >
                {{ r.crm_id }}
              </p>
              <p>{{ r.customer.name }}</p>
              <p>{{ getFormatDate(r.balance_due_date) }}</p>
            </div>
            <div class="text-end space-y-1">
              <p>Total: {{ formattedNumber(r.grand_total) }}</p>
              <p>Deposit: {{ formattedNumber(r.deposit) }}</p>
              <p class="font-semibold text-red-600 text-base">
                Due: {{ formattedNumber(r.balance_due) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAdminStore } from "../../stores/admin";
import { storeToRefs } from "pinia";
import { useReservationStore } from "../../stores/reservation";
import { format } from "date-fns";
import {
  formattedDate,
  formattedNumber,
  getFormatDate,
} from "../help/FormatData";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

// Date filter states
const changeDate = ref("");
const selectedMonth = ref("");

// Agent and data states
const selectedAgent = ref("");
const dataCount = ref(0);
const dataSummary = ref(0);

const adminStore = useAdminStore();
const reservationStore = useReservationStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { admin } = storeToRefs(adminStore);
const { receivables, loading } = storeToRefs(reservationStore);

const router = useRouter();

// Generate month options for the current year and next year
const monthOptions = computed(() => {
  const options = [];
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Add months for current year and next year
  for (let year = currentYear; year <= currentYear + 1; year++) {
    months.forEach((month, index) => {
      const monthNumber = String(index + 1).padStart(2, "0");
      const value = `${monthNumber}-${year}`;
      const label = `${month} ${year}`;
      options.push({ value, label });
    });
  }

  return options;
});

// Date formatting functions
const formatDate = (datePut) => {
  const date = new Date(datePut);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

// Date filter functions
const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  selectedMonth.value = ""; // Clear month selection

  if (data == "today") {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateParam = `${month}-${year}`;
    console.log(`Today filter - date: ${dateParam}`);
    getReceivables({ date: dateParam });
  } else if (data == "7day") {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateParam = `${month}-${year}`;
    console.log(`7 days filter - date: ${dateParam}`);
    getReceivables({ date: dateParam });
  }
};

// Month change handler
const onMonthChange = () => {
  if (selectedMonth.value) {
    changeDate.value = ""; // Clear other date selections
    console.log("Selected month:", selectedMonth.value);
    getReceivables({ date: selectedMonth.value });
  }
};

// Admin list functions
const adminOnlyLists = ref([]);
const adminOnlyListAction = async () => {
  if (user.value != null) {
    if (
      admin.value &&
      admin.value.data &&
      admin.value.data.length > 0 &&
      user.value?.role === "super_admin"
    ) {
      adminOnlyLists.value = admin.value.data.filter(
        (admin) => admin.role === "admin" || admin.role === "sale_manager"
      );
    } else if (
      admin.value &&
      admin.value.data &&
      admin.value.data.length > 0 &&
      user.value?.role === "sale_manager"
    ) {
      const res = await adminStore.getSaleManager();
      console.log("Sale Manager Admin List:", res);
      let manager = res.result.data.find((a) => a.id == authStore.user?.id);
      adminOnlyLists.value = manager.subsidiaries?.map((item) => item) || [];
      adminOnlyLists.value.push(manager);
    }
  }
};

const adminOnlyList = async () => {
  const res = await adminStore.getSimpleListAction();
  console.log("Admin Only List:", res);
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blank");
  console.log("Navigating to booking:", id);
};

// Modified getReceivables function
const getReceivables = async (dateParams = {}) => {
  try {
    const params = { ...dateParams };

    // Only add admin_id if a specific agent is selected
    if (selectedAgent.value || authStore.isSuperAdmin) {
      params.admin_id = selectedAgent.value;
    }

    if (!authStore.isSuperAdmin) {
      params.admin_id = authStore.user?.id;
    }

    console.log("API Parameters:", params);
    const res = await reservationStore.receiviableAction(params);
    console.log("Receivables:", receivables.value);

    if (receivables.value) {
      dataCount.value = receivables.value.length;
      dataSummary.value = receivables.value.reduce(
        (sum, r) => sum + parseFloat(r.balance_due || 0),
        0
      );
    } else {
      dataCount.value = 0;
      dataSummary.value = 0;
    }
  } catch (error) {
    console.error("Error fetching receivables:", error);
  }
};

// Watchers
watch(selectedAgent, async () => {
  // Re-apply current date filter when agent changes
  if (changeDate.value === "today") {
    changeServiceDate("today");
  } else if (changeDate.value === "7day") {
    changeServiceDate("7day");
  } else if (selectedMonth.value) {
    getReceivables({ date: selectedMonth.value });
  } else {
    // Default to current month if no filter is selected
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateParam = `${month}-${year}`;
    await getReceivables({ date: dateParam });
  }
});

onMounted(async () => {
  await authStore.getMe();
  await adminOnlyListAction();
  await adminOnlyList();
  changeServiceDate("today");
  console.log(user.value, "this is user");
});
</script>
